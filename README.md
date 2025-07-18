# AI Filmmaking Platform

A comprehensive AI-powered filmmaking platform inspired by Adobe Firefly's design. Create stunning films using 15 AI tools powered by Replicate, from pre-production to distribution.

## 🎬 Features

### **Complete AI Filmmaking Pipeline**
- **Pre-Production**: Torch Builder, Script Writer, Character Builder, Environment Builder, Story Board Builder
- **Production**: Animation, Voices, Lip Sync, Music, SFX
- **Post-Production**: Titles, VFX, Editing
- **Distribution**: Product, Distribution

### **Beautiful Adobe Firefly-Inspired Design**
- Purple gradient hero section
- Clean tool cards with hover animations
- Responsive design for all devices
- Professional UI/UX

### **AI Integration**
- Powered by Replicate API
- Text generation with LLama models
- Image generation with SDXL
- Video generation with Stable Video Diffusion
- Audio generation with Bark

### **Project Management**
- Create and manage filmmaking projects
- Track tools used per project
- Beautiful project dashboard

## 🚀 Quick Start

### **Try Demo Mode First!**
The platform works immediately with sample AI responses. No setup required for demo:

```bash
git clone <your-repo-url>
cd ai-filmmaking-platform
cd frontend && yarn install
cd ../backend && pip install -r requirements.txt
# Start both servers and visit http://localhost:3000
```

### **Full AI Setup (Optional)**

### Prerequisites
- Node.js 18+ and yarn
- Python 3.9+
- MongoDB
- Replicate API account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-filmmaking-platform
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   
   # Frontend
   cd ../frontend
   yarn install
   ```

3. **Set up environment variables**
   
   **Backend (.env):**
   ```env
   MONGO_URL=mongodb://localhost:27017
   DATABASE_NAME=ai_filmmaking_db
   JWT_SECRET_KEY=your-secret-key-here
   REPLICATE_API_TOKEN=your-replicate-api-token-here
   ```
   
   **Frontend (.env):**
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

4. **Get your Replicate API token (Optional - for real AI)**
   - The platform works in demo mode without API keys
   - For real AI functionality: Sign up at [replicate.com](https://replicate.com)
   - Go to [API tokens](https://replicate.com/account/api-tokens)
   - Create a new token and replace the empty value in `backend/.env`

5. **Start the application**
   ```bash
   # Terminal 1: Start MongoDB
   mongod
   
   # Terminal 2: Start Backend
   cd backend
   python server.py
   
   # Terminal 3: Start Frontend
   cd frontend
   yarn start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001
   - **Demo Mode**: Works immediately with sample AI responses
   - **Live Mode**: Add Replicate API token for real AI functionality

## 🎭 Demo vs Live Mode

### **Demo Mode (No API Key Required)**
- ✅ Beautiful UI and all functionality
- ✅ Sample AI responses for all tools
- ✅ Complete workflow demonstration
- ✅ Project management works fully
- ✅ Perfect for testing and development

### **Live Mode (Requires Replicate API Key)**
- 🤖 Real AI-generated scripts with LLama models
- 🎨 Real AI-generated images with SDXL
- 🎬 Real AI-generated videos with Stable Video Diffusion
- 🎵 Real AI-generated audio with Bark
- 💰 Uses Replicate credits for generations

## 🛠️ Technology Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion
- **Backend**: FastAPI, Python
- **Database**: MongoDB
- **AI Integration**: Replicate API
- **Authentication**: JWT tokens
- **File Upload**: React Dropzone

## 📁 Project Structure

```
ai-filmmaking-platform/
├── backend/
│   ├── server.py          # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js        # Main application
│   │   └── index.css     # Global styles
│   ├── package.json      # Node dependencies
│   └── .env              # Frontend environment variables
└── README.md
```

## 🎨 AI Tools Overview

### Pre-Production Tools
- **🔧 Torch Builder**: Configure AI models and settings
- **📝 Script Writer**: Generate screenplays with AI
- **👤 Character Builder**: Create character designs
- **🌄 Environment Builder**: Generate backgrounds and sets
- **📋 Story Board Builder**: Create visual storyboards

### Production Tools
- **🎬 Animation**: Generate animated sequences
- **🎤 Voices**: AI voice synthesis
- **💋 Lip Sync**: Synchronize lips with audio
- **🎵 Music**: Generate background music
- **🔊 SFX**: Create sound effects

### Post-Production Tools
- **🔤 Titles**: Generate text overlays
- **✨ VFX**: Add visual effects
- **✂️ Editing**: AI-powered video editing

### Distribution Tools
- **📦 Product**: Finalize for distribution
- **🌐 Distribution**: Platform optimization

## 🔧 API Endpoints

### Tools
- `GET /api/tools` - Get all tools
- `GET /api/tools/category/{category}` - Get tools by category
- `POST /api/tools/execute` - Execute a tool

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details

### Health
- `GET /api/health` - Health check

## 🚨 Security Note

**Never commit your API keys to version control!**

The `.env` files contain placeholder values. You must:
1. Get your own Replicate API token
2. Replace the placeholder in `backend/.env`
3. Keep your API keys secure

## 📝 Usage Example

1. **Create a Project**
   - Go to Projects section
   - Click "Create New Project"
   - Enter project details

2. **Generate a Script**
   - Select "Script Writer" tool
   - Enter your story prompt
   - Click "Execute Script Writer"
   - Get AI-generated screenplay

3. **Create Characters**
   - Select "Character Builder" tool
   - Describe your character
   - Get AI-generated character images

4. **Build Your Film**
   - Use tools in sequence
   - Track progress in your project
   - Export final product

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Adobe Firefly's beautiful design
- Powered by Replicate's AI models
- Built with modern web technologies

---

**🎬 Create amazing films with AI! 🎬**