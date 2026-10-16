export const COMMUNITY_COLORS: Record<number, { hex: string; name: string; bg: string; border: string }> = {
  0: { hex: '#06B6D4', name: 'Cluster Alpha (Cyan)', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  1: { hex: '#8B5CF6', name: 'Cluster Beta (Violet)', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  2: { hex: '#10B981', name: 'Cluster Gamma (Emerald)', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  3: { hex: '#F59E0B', name: 'Cluster Delta (Amber)', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  4: { hex: '#F43F5E', name: 'Cluster Epsilon (Rose)', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
  5: { hex: '#6366F1', name: 'Cluster Zeta (Indigo)', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
  6: { hex: '#3B82F6', name: 'Cluster Eta (Blue)', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  7: { hex: '#14B8A6', name: 'Cluster Theta (Teal)', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
};

export const DATASET_DISCLAIMERS = {
  gplus: "GPlus Social Circles dataset is used strictly as a structural topological benchmark. Nodes represent social circles and do not represent criminal entities.",
  crime: "Crime in India (2001-2012) represents aggregate district and state-level statistics published by the National Crime Records Bureau. These macroscopic statistics do not identify individual persons or specific networks.",
  synthetic: "Synthetic Demonstration — Multi-relational network generated programmatically to demonstrate cross-community link detection and role analysis. All entities and locations are explicitly fictional.",
  ml: "All predictive models are evaluated on verifiable empirical IPC crime counts or synthetic topological graphs. NetworkTrace never produces automated criminality scores for real individuals."
};
