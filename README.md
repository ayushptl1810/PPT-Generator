# SlideForge AI - PPT Generator

An AI-powered presentation generator with a modern React frontend and FastAPI backend.

## 🚀 Vercel Deployment

This project is optimized for Vercel deployment with both frontend and backend.

### Quick Deploy

1. **Connect to Vercel**: Import your GitHub repository to Vercel
2. **Environment Variables**: Set up your API keys in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `GOOGLE_API_KEY`
3. **Deploy**: Vercel will automatically build and deploy

### Build Commands (for Vercel settings)

- **Build Command**: `npm run build:frontend`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install && cd frontend && npm install`

## 🛠️ Local Development

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend concurrently
npm run dev

# Or run separately:
# Backend: cd backend && uvicorn app:app --reload --port 8000
# Frontend: cd frontend && npm run dev
```

## 📁 Project Structure

```
├── frontend/          # React + Vite + TailwindCSS
├── backend/           # FastAPI + Python-PPTX
├── package.json       # Root package with build scripts
├── vercel.json        # Vercel deployment configuration
└── README.md          # This file
```

## 🔧 Features

- ✨ Modern glassmorphism UI with animations
- 🤖 Multiple AI providers (OpenAI, Anthropic, Google Gemini)
- 📊 Real-time presentation generation
- 💾 History tracking with local storage
- 📱 Responsive design
- 🎨 Custom PowerPoint template support
