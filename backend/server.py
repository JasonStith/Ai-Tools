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
replicate_client = replicate.Client(api_token=os.getenv("REPLICATE_API_TOKEN"))

# Security
security = HTTPBearer()

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
        "name": "Torch Builder",
        "category": "Pre-Production",
        "description": "Build and configure AI models and settings",
        "replicate_model": "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        "inputs": {"prompt": "text", "negative_prompt": "text"},
        "icon": "🔧"
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
        
        # Store result in database
        execution_record = {
            "id": str(uuid.uuid4()),
            "tool_name": request.tool_name,
            "inputs": request.inputs,
            "result": result,
            "project_id": request.project_id,
            "created_at": "2025-01-01T00:00:00Z"
        }
        
        await db.executions.insert_one(execution_record)
        
        return {
            "success": True,
            "result": result,
            "execution_id": execution_record["id"]
        }
        
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
        
        await db.projects.insert_one(project_data)
        
        return {
            "success": True,
            "project": project_data
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
        # Test with a simple model
        result = replicate_client.run(
            "meta/llama-2-7b-chat:8e6975e5ed6174911a6ff3d60540dfd4844201974602551e10e9e87ab143d81e",
            input={"prompt": "Hello, this is a test from AI Filmmaking Platform"}
        )
        return {"success": True, "result": result}
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
            "project": project,
            "executions": executions
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch project: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)