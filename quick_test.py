#!/usr/bin/env python3
"""
Quick test for the fixed endpoints
"""

import requests
import json

BACKEND_URL = "https://5b948487-4ac8-4df0-81a6-d13e8aa6f2bc.preview.emergentagent.com/api"

def test_fixed_endpoints():
    print("🔧 Testing Fixed Endpoints...")
    
    # Test project creation
    print("\n1. Testing Project Creation...")
    payload = {
        "name": "Test Project",
        "description": "A test project for validation",
        "tools_used": ["Script Writer"]
    }
    
    response = requests.post(f"{BACKEND_URL}/projects", json=payload)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        project_id = data.get("project", {}).get("id")
        print(f"✅ Project created successfully: {project_id}")
        
        # Test get projects
        print("\n2. Testing Get Projects...")
        response = requests.get(f"{BACKEND_URL}/projects")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Retrieved {len(data.get('projects', []))} projects")
        else:
            print(f"❌ Failed: {response.text}")
            
        # Test get project by ID
        print("\n3. Testing Get Project by ID...")
        response = requests.get(f"{BACKEND_URL}/projects/{project_id}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Project retrieved successfully")
        else:
            print(f"❌ Failed: {response.text}")
            
    else:
        print(f"❌ Project creation failed: {response.text}")
    
    # Test invalid tool error handling
    print("\n4. Testing Invalid Tool Error Handling...")
    payload = {
        "tool_name": "NonExistentTool",
        "inputs": {"prompt": "test"}
    }
    
    response = requests.post(f"{BACKEND_URL}/tools/execute", json=payload)
    print(f"Status: {response.status_code}")
    if response.status_code == 404:
        print("✅ Correctly returned 404 for invalid tool")
    else:
        print(f"❌ Expected 404, got {response.status_code}: {response.text}")
        
    # Test invalid project ID
    print("\n5. Testing Invalid Project ID...")
    response = requests.get(f"{BACKEND_URL}/projects/invalid-id")
    print(f"Status: {response.status_code}")
    if response.status_code == 404:
        print("✅ Correctly returned 404 for invalid project ID")
    else:
        print(f"❌ Expected 404, got {response.status_code}: {response.text}")

if __name__ == "__main__":
    test_fixed_endpoints()