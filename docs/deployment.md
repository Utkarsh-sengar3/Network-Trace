# NetworkTrace Deployment Guide

## 1. Local Development Setup

### Prerequisites
* Python 3.10+
* Node.js v18+ / v20+ / v24+ & npm

### Backend Setup (FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at `http://127.0.0.1:8000/docs`.

### Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Web application will be accessible at `http://localhost:3000`.

---

## 2. Production Deployment

### Frontend (Vercel)
1. Link your GitHub repository to Vercel.
2. Root Directory: `frontend`
3. Framework Preset: `Next.js`
4. Set Environment Variable:
   * `NEXT_PUBLIC_API_URL` = `https://your-backend-service.railway.app`
5. Deploy.

### Backend (Railway / Render / Docker)
1. Root Directory: `backend`
2. Start Command:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
3. Set CORS allowed origins in `app/main.py` to your Vercel frontend URL.
