from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import Optional, List
import os
import uuid
import replicate
from dotenv import load_dotenv
import base64
import httpx
import json
from bson import ObjectId

load_dotenv()

# Helper function to convert MongoDB documents to JSON serializable format
def serialize_doc(doc):
    """Convert MongoDB document to JSON serializable format"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(item) for item in doc]
    if isinstance(doc, dict):
        result = {}
        for key, value in doc.items():
            if key == "_id":
                continue  # Skip MongoDB _id field
            elif isinstance(value, ObjectId):
                result[key] = str(value)
            elif isinstance(value, dict):
                result[key] = serialize_doc(value)
            elif isinstance(value, list):
                result[key] = serialize_doc(value)
            else:
                result[key] = value
        return result
    return doc

app = FastAPI(title="AI Filmmaking Platform")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
db = client[os.getenv("DATABASE_NAME")]

# Replicate client
replicate_api_token = os.getenv("REPLICATE_API_TOKEN")
if replicate_api_token:
    replicate_client = replicate.Client(api_token=replicate_api_token)
else:
    replicate_client = None

# Dummy data for demo purposes
DUMMY_RESPONSES = {
    "Brainstorm Ideas": """🎬 CREATIVE BRAINSTORMING SESSION 💡

Here are some compelling film concepts and ideas:

**CONCEPT 1: "The Memory Architect"**
- Genre: Sci-Fi Thriller
- Logline: A neuroscientist discovers she can edit memories, but when she tries to erase her own trauma, she uncovers a conspiracy that threatens reality itself.
- Visual Style: Neo-noir with holographic elements
- Target Audience: Adult, fans of Black Mirror and Inception

**CONCEPT 2: "Last Stop Diner"**
- Genre: Supernatural Drama
- Logline: A mysterious 24-hour diner appears to people at crossroads in their lives, serving more than just coffee—it serves second chances.
- Visual Style: Warm, nostalgic Americana with magical realism
- Target Audience: Universal appeal, heartwarming yet mysterious

**CONCEPT 3: "Digital Ghosts"**
- Genre: Horror/Tech Thriller
- Logline: When a social media influencer inherits her grandmother's house, she discovers the elderly woman has been livestreaming her afterlife.
- Visual Style: Found footage meets traditional cinematography
- Target Audience: Young adults, horror enthusiasts

**DEVELOPMENT SUGGESTIONS:**
- Consider character arcs that reflect modern anxieties
- Explore themes of technology vs. humanity
- Think about practical locations and budget-friendly effects
- Develop unique visual languages for each concept

Which concept resonates most with your vision? I can help develop any of these further!""",

    "Script Writer": """FADE IN:

EXT. COFFEE SHOP - DAY

A bustling coffee shop with large windows. SARAH (28), a determined filmmaker, sits across from ALEX (30), a tech-savvy AI developer.

SARAH
(excitedly)
This is incredible! With AI helping us create films, we can bring any story to life.

ALEX
(smiling)
That's the vision. From script to screen, AI can handle the technical complexities while you focus on the creative story.

SARAH
(leaning forward)
Show me what it can do.

Alex opens a laptop, revealing the AI Filmmaking Platform interface.

ALEX
Pick any genre, any setting. Let's create something amazing together.

SARAH
(grinning)
Science fiction. A world where humans and AI collaborate to explore the universe.

ALEX
(typing)
Coming right up...

FADE OUT.""",

    "Character Builder": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNjY2NmZmIDAlLCAjZGQ0NGZmIDUwJSwgIzAwYmJmZiAxMDAlKSIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNTAiIHI9IjUwIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KPHJlY3QgeD0iMTcwIiB5PSIyMDAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuOSIvPgo8dGV4dCB4PSIyMDAiIHk9IjM1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R2VuZXJhdGVkIENoYXJhY3RlcjwvdGV4dD4KPC9zdmc+",

    "Environment Builder": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjMDA5OWZmIDAlLCAjNjZjY2ZmIDUwJSwgIzAwZmY5OSAxMDAlKSIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjMwIiBmaWxsPSIjZmZmZjAwIiBmaWxsLW9wYWNpdHk9IjAuOCIvPgo8cG9seWdvbiBwb2ludHM9IjUwLDM1MCAzNTAsMzUwIDIwMCwyMDAiIGZpbGw9IiMwMGZmMDAiIGZpbGwtb3BhY2l0eT0iMC43Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMzgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5HZW5lcmF0ZWQgRW52aXJvbm1lbnQ8L3RleHQ+Cjwvc3ZnPg==",

    "Story Board Builder": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE3MCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlNWU3ZWIiIHN0cm9rZT0iIzk5YTNhNCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxyZWN0IHg9IjIxMCIgeT0iMjAiIHdpZHRoPSIxNzAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZTVlN2ViIiBzdHJva2U9IiM5OWEzYTQiIHN0cm9rZS13aWR0aD0iMiIvPgo8cmVjdCB4PSIyMCIgeT0iMTQwIiB3aWR0aD0iMTcwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTdlYiIgc3Ryb2tlPSIjOTlhM2E0IiBzdHJva2Utd2lkdGg9IjIiLz4KPHJlY3QgeD0iMjEwIiB5PSIxNDAiIHdpZHRoPSIxNzAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZTVlN2ViIiBzdHJva2U9IiM5OWEzYTQiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIyMDAiIHk9IjMwMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjNGE1NTY4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5HZW5lcmF0ZWQgU3RvcnlibGFyZDwvdGV4dD4KPC9zdmc+",

    "Animation": "https://replicate.delivery/pbxt/dummy-animation-video.mp4",
    
    "Voices": "Generated voice audio would be available here. Sample: 'Welcome to the AI Filmmaking Platform, where creativity meets technology.'",
    
    "Lip Sync": "Lip sync animation would be generated here with synchronized mouth movements.",
    
    "Music": "🎵 Generated background music: Epic orchestral score with rising crescendo, perfect for sci-fi adventure scenes.",
    
    "SFX": "🔊 Generated sound effects: Futuristic beeping, whoosh sounds, and atmospheric ambiance.",
    
    "Titles": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMTExODI3Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BSSBGSUxNPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjYWFhYWFhIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UaGUgRnV0dXJlIG9mIEZpbG1tYWtpbmc8L3RleHQ+Cjwvc3ZnPg==",
    
    "VFX": "Visual effects would be applied here: particle systems, lighting effects, and post-processing filters.",
    
    "Editing": "Video editing complete: transitions added, color correction applied, final cut ready for export.",
    
    "Product": "Final product ready: 1080p MP4 video, optimized for web streaming and social media.",
    
    "Distribution": "Distribution ready: Video optimized for YouTube, Instagram, TikTok, and cinema formats.",

    "Torch Builder": "AI model configuration complete: Custom settings applied, training parameters optimized, model ready for fine-tuning and deployment."
}

# Models
class ToolRequest(BaseModel):
    tool_name: str
    inputs: dict
    project_id: Optional[str] = None

class ProjectModel(BaseModel):
    name: str
    description: str
    tools_used: List[str] = []

class ToolModel(BaseModel):
    name: str
    category: str
    description: str
    replicate_model: str
    inputs: dict
    icon: str

# AI Tools Configuration
AI_TOOLS = [
    {
        "name": "Brainstorm Ideas",
        "category": "Pre-Production",
        "description": "Generate creative concepts and ideas for your film projects",
        "replicate_model": "meta/llama-2-7b-chat:8e6975e5ed6174911a6ff3d60540dfd4844201974602551e10e9e87ab143d81e",
        "inputs": {"prompt": "text", "genre": "text"},
        "icon": "💡"
    },
    {
        "name": "Script Writer",
        "category": "Pre-Production", 
        "description": "AI-powered screenplay and script generation",
        "replicate_model": "meta/llama-2-7b-chat:8e6975e5ed6174911a6ff3d60540dfd4844201974602551e10e9e87ab143d81e",
        "inputs": {"prompt": "text", "system_prompt": "text"},
        "icon": "📝"
    },
    {
        "name": "Character Builder",
        "category": "Pre-Production",
        "description": "Design and create characters for your film",
        "replicate_model": "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        "inputs": {"prompt": "text", "style": "text"},
        "icon": "👤"
    },
    {
        "name": "Environment Builder", 
        "category": "Pre-Production",
        "description": "Create stunning environments and backgrounds",
        "replicate_model": "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        "inputs": {"prompt": "text", "aspect_ratio": "text"},
        "icon": "🌄"
    },
    {
        "name": "Story Board Builder",
        "category": "Pre-Production",
        "description": "Generate visual storyboards from your script",
        "replicate_model": "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        "inputs": {"prompt": "text", "style": "text"},
        "icon": "📋"
    },
    {
        "name": "Animation",
        "category": "Production",
        "description": "Generate animated sequences",
        "replicate_model": "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb1a4c069c4c2f5b9bab8c0bb78c1d0b8d6ab77e0c",
        "inputs": {"image": "image", "motion_bucket_id": "integer"},
        "icon": "🎬"
    },
    {
        "name": "Voices",
        "category": "Production",
        "description": "AI voice generation and synthesis",
        "replicate_model": "suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787",
        "inputs": {"prompt": "text", "text_prompt": "text"},
        "icon": "🎤"
    },
    {
        "name": "Lip Sync",
        "category": "Production",
        "description": "Synchronize lips with audio",
        "replicate_model": "devxpy/codeformer:7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56",
        "inputs": {"image": "image", "audio": "audio"},
        "icon": "💋"
    },
    {
        "name": "Music",
        "category": "Production",
        "description": "Generate background music and soundtracks",
        "replicate_model": "suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787",
        "inputs": {"prompt": "text", "duration": "integer"},
        "icon": "🎵"
    },
    {
        "name": "SFX",
        "category": "Production",
        "description": "Create sound effects",
        "replicate_model": "suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787",
        "inputs": {"prompt": "text", "type": "text"},
        "icon": "🔊"
    },
    {
        "name": "Titles",
        "category": "Post-Production",
        "description": "Generate titles and text overlays",
        "replicate_model": "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        "inputs": {"text": "text", "style": "text"},
        "icon": "🔤"
    },
    {
        "name": "VFX",
        "category": "Post-Production",
        "description": "Add visual effects to your footage",
        "replicate_model": "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb1a4c069c4c2f5b9bab8c0bb78c1d0b8d6ab77e0c",
        "inputs": {"image": "image", "effect_type": "text"},
        "icon": "✨"
    },
    {
        "name": "Editing",
        "category": "Post-Production",
        "description": "AI-powered video editing and assembly",
        "replicate_model": "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb1a4c069c4c2f5b9bab8c0bb78c1d0b8d6ab77e0c",
        "inputs": {"video": "video", "instructions": "text"},
        "icon": "✂️"
    },
    {
        "name": "Product",
        "category": "Distribution",
        "description": "Finalize your film for distribution",
        "replicate_model": "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb1a4c069c4c2f5b9bab8c0bb78c1d0b8d6ab77e0c",
        "inputs": {"video": "video", "format": "text"},
        "icon": "📦"
    },
    {
        "name": "Torch Builder",
        "category": "Distribution",
        "description": "Build and configure AI models and settings",
        "replicate_model": "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        "inputs": {"prompt": "text", "negative_prompt": "text"},
        "icon": "🔧"
    },
    {
        "name": "Distribution",
        "category": "Distribution",
        "description": "Optimize and prepare for various platforms",
        "replicate_model": "stability-ai/stable-video-diffusion:3f0457e4619daac51203dedb1a4c069c4c2f5b9bab8c0bb78c1d0b8d6ab77e0c",
        "inputs": {"video": "video", "platform": "text"},
        "icon": "🌐"
    }
]

# Root endpoint
@app.get("/")
async def root():
    return {"message": "AI Filmmaking Platform API"}

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "AI Filmmaking Platform"}

# Get all tools
@app.get("/api/tools")
async def get_tools():
    return {"tools": AI_TOOLS}

# Get tools by category
@app.get("/api/tools/category/{category}")
async def get_tools_by_category(category: str):
    filtered_tools = [tool for tool in AI_TOOLS if tool["category"] == category]
    return {"tools": filtered_tools, "category": category}

# Execute tool
@app.post("/api/tools/execute")
async def execute_tool(request: ToolRequest):
    try:
        # Find the tool
        tool = next((t for t in AI_TOOLS if t["name"] == request.tool_name), None)
        if not tool:
            raise HTTPException(status_code=404, detail="Tool not found")
        
        # Check if we have a real API key or use dummy data
        if replicate_client and replicate_api_token:
            # Execute with Replicate
            result = replicate_client.run(
                tool["replicate_model"],
                input=request.inputs
            )
            
            # Handle different result types
            if hasattr(result, '__iter__') and not isinstance(result, (str, bytes)):
                # It's a generator or list, join the output
                result = ''.join(str(item) for item in result)
            elif not isinstance(result, (str, dict, list, int, float, bool)):
                # Convert other types to string
                result = str(result)
        else:
            # Use dummy data for demo
            result = DUMMY_RESPONSES.get(request.tool_name, f"Demo output for {request.tool_name}: This is a placeholder result. Add your Replicate API token to get real AI-generated content.")
        
        # Store result in database
        execution_record = {
            "id": str(uuid.uuid4()),
            "tool_name": request.tool_name,
            "inputs": request.inputs,
            "result": result,
            "project_id": request.project_id,
            "created_at": "2025-01-01T00:00:00Z",
            "is_demo": not bool(replicate_client and replicate_api_token)
        }
        
        await db.executions.insert_one(execution_record)
        
        return {
            "success": True,
            "result": result,
            "execution_id": execution_record["id"],
            "is_demo": execution_record["is_demo"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tool execution failed: {str(e)}")

# Create project
@app.post("/api/projects")
async def create_project(project: ProjectModel):
    try:
        project_data = {
            "id": str(uuid.uuid4()),
            "name": project.name,
            "description": project.description,
            "tools_used": project.tools_used,
            "created_at": "2025-01-01T00:00:00Z",
            "updated_at": "2025-01-01T00:00:00Z"
        }
        
        result = await db.projects.insert_one(project_data)
        
        return {
            "success": True,
            "project": serialize_doc(project_data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Project creation failed: {str(e)}")

# Get projects
@app.get("/api/projects")
async def get_projects():
    try:
        projects = await db.projects.find().to_list(100)
        serialized_projects = serialize_doc(projects)
        return {"projects": serialized_projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch projects: {str(e)}")

# Test Replicate connection
@app.get("/api/test-replicate")
async def test_replicate():
    try:
        if replicate_client and replicate_api_token:
            # Test with a simple model
            result = replicate_client.run(
                "meta/llama-2-7b-chat:8e6975e5ed6174911a6ff3d60540dfd4844201974602551e10e9e87ab143d81e",
                input={"prompt": "Hello, this is a test from AI Filmmaking Platform"}
            )
            return {"success": True, "result": result, "mode": "live"}
        else:
            return {
                "success": True, 
                "result": "Demo mode: Replicate connection would work here. Add your API token to enable real AI functionality.",
                "mode": "demo"
            }
    except Exception as e:
        return {"success": False, "error": str(e)}

# Get project by ID
@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    try:
        project = await db.projects.find_one({"id": project_id})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Get executions for this project
        executions = await db.executions.find({"project_id": project_id}).to_list(100)
        
        return {
            "project": serialize_doc(project),
            "executions": serialize_doc(executions)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch project: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)