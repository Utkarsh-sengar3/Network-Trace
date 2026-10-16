'use client';

import React, { useEffect, useRef, useState } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { NodeItem, EdgeItem } from '@/lib/types';
import { COMMUNITY_COLORS } from '@/lib/constants';
import { ZoomIn, ZoomOut, Maximize2, RefreshCw, Layers, Sliders, Eye } from 'lucide-react';

interface CytoscapeGraphProps {
  nodes: NodeItem[];
  edges: EdgeItem[];
  selectedNodeId?: string | null;
  onNodeSelect?: (nodeId: string | null) => void;
  highlightCommunityId?: number | null;
  highlightBridgeOnly?: boolean;
  layoutName?: 'cose' | 'concentric' | 'circle' | 'grid';
  height?: string;
}

export const CytoscapeGraph: React.FC<CytoscapeGraphProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onNodeSelect,
  highlightCommunityId,
  highlightBridgeOnly,
  layoutName = 'cose',
  height = '600px',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [currentLayout, setCurrentLayout] = useState<string>(layoutName);
  const [edgeCurvature, setEdgeCurvature] = useState<boolean>(true);

  // Initialize and update Cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    // Convert nodes & edges to Cytoscape elements format
    const cyNodes = nodes.map((n) => {
      const commColor = COMMUNITY_COLORS[n.community_id]?.hex || '#06B6D4';
      const isBridge = n.is_bridge;
      const size = Math.min(36, Math.max(14, 12 + Math.sqrt(n.degree) * 1.6));

      return {
        data: {
          id: n.node_id,
          label: n.node_id.length > 8 ? n.node_id.slice(-4) : n.node_id,
          full_id: n.node_id,
          community_id: n.community_id,
          degree: n.degree,
          betweenness: n.betweenness_centrality,
          is_bridge: isBridge,
          color: isBridge ? '#FCD34D' : commColor,
          borderColor: isBridge ? '#F59E0B' : '#0F172A',
          borderWidth: isBridge ? 3 : 1.5,
          size: isBridge ? size * 1.3 : size,
        },
      };
    });

    const cyEdges = edges.map((e, idx) => ({
      data: {
        id: `e_${e.source}_${e.target}_${idx}`,
        source: e.source,
        target: e.target,
        is_cross: e.is_cross_community,
      },
    }));

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: [...cyNodes, ...cyEdges],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': 'data(color)',
            'width': 'data(size)',
            'height': 'data(size)',
            'border-color': 'data(borderColor)',
            'border-width': 'data(borderWidth)',
            'label': '',
            'color': '#F8FAFC',
            'font-size': '10px',
            'font-family': 'monospace',
            'text-valign': 'bottom',
            'text-margin-y': 4,
            'transition-property': 'background-color, border-color, width, height, opacity',
            'transition-duration': 0.2,
          },
        },
        {
          selector: 'node[?is_bridge]',
          style: {
            'shadow-blur': 12,
            'shadow-color': '#F59E0B',
            'shadow-opacity': 0.8,
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 1,
            'line-color': '#334155',
            'opacity': 0.25,
            'curve-style': 'bezier',
            'transition-property': 'line-color, width, opacity',
            'transition-duration': 0.2,
          },
        },
        {
          selector: 'edge[?is_cross]',
          style: {
            'line-color': '#64748B',
            'line-style': 'dashed',
            'opacity': 0.45,
            'width': 1.2,
          },
        },
        // Active / Highlighted State
        {
          selector: '.highlighted',
          style: {
            'opacity': 1,
            'z-index': 999,
          },
        },
        {
          selector: 'node.highlighted',
          style: {
            'border-color': '#38BDF8',
            'border-width': 3.5,
            'label': 'data(label)',
            'shadow-blur': 16,
            'shadow-color': '#38BDF8',
            'shadow-opacity': 0.9,
          },
        },
        {
          selector: 'edge.highlighted',
          style: {
            'line-color': '#38BDF8',
            'width': 2.5,
            'opacity': 0.9,
            'z-index': 998,
          },
        },
        {
          selector: '.faded',
          style: {
            'opacity': 0.08,
          },
        },
      ],
      layout: {
        name: currentLayout,
        animate: false,
        randomize: false,
        nodeRepulsion: () => 450000,
        idealEdgeLength: () => 100,
        edgeElasticity: () => 100,
        gravity: 80,
        numIter: 250,
      } as any,
      minZoom: 0.1,
      maxZoom: 4.0,
      wheelSensitivity: 0.25,
    });

    cy.on('tap', 'node', (evt: EventObject) => {
      const node = evt.target;
      const nodeId = node.data('full_id') || node.id();
      if (onNodeSelect) {
        onNodeSelect(nodeId);
      }
    });

    cy.on('tap', (evt: EventObject) => {
      if (evt.target === cy) {
        if (onNodeSelect) {
          onNodeSelect(null);
        }
      }
    });

    cyRef.current = cy;

    return () => {
      cy.destroy();
    };
  }, [nodes, edges, currentLayout]);

  // Apply visual highlights when selectedNodeId or community filter changes
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    cy.batch(() => {
      cy.elements().removeClass('highlighted faded');

      if (selectedNodeId) {
        const targetNode = cy.$(`node[id = "${selectedNodeId}"]`);
        if (targetNode.length > 0) {
          const neighborhood = targetNode.neighborhood().add(targetNode);
          cy.elements().addClass('faded');
          neighborhood.removeClass('faded').addClass('highlighted');
        }
      } else if (highlightCommunityId !== null && highlightCommunityId !== undefined) {
        const commNodes = cy.$(`node[community_id = ${highlightCommunityId}]`);
        const commEdges = commNodes.connectedEdges();
        cy.elements().addClass('faded');
        commNodes.removeClass('faded').addClass('highlighted');
        commEdges.removeClass('faded').addClass('highlighted');
      } else if (highlightBridgeOnly) {
        const bridgeNodes = cy.$('node[?is_bridge]');
        const bridgeEdges = bridgeNodes.connectedEdges();
        cy.elements().addClass('faded');
        bridgeNodes.removeClass('faded').addClass('highlighted');
        bridgeEdges.removeClass('faded').addClass('highlighted');
      }
    });
  }, [selectedNodeId, highlightCommunityId, highlightBridgeOnly]);

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.3);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.75);
  const handleFit = () => cyRef.current?.fit(undefined, 30);
  const handleRelayout = (name: string) => {
    setCurrentLayout(name);
    cyRef.current?.layout({ name, animate: true, animationDuration: 400 } as any).run();
  };

  return (
    <div className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl group" style={{ height }}>
      {/* Top Floating Graph Controls Bar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl shadow-lg">
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleFit}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded-lg transition-colors"
          title="Fit to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        {/* Layout Switcher */}
        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
          {(['cose', 'concentric', 'circle'] as const).map((l) => (
            <button
              key={l}
              onClick={() => handleRelayout(l)}
              className={`px-2 py-0.5 rounded uppercase ${
                currentLayout === l
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'hover:bg-slate-800 text-slate-500'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Info Tag */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono text-slate-400">
        <span>Nodes: <strong className="text-white">{nodes.length}</strong></span>
        <span>•</span>
        <span>Edges: <strong className="text-white">{edges.length}</strong></span>
        <span>•</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          Bridge Node
        </span>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
