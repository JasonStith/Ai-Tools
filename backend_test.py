#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for AI Filmmaking Platform
Tests all core API endpoints with realistic data and AI integration
"""

import requests
import json
import uuid
import time
from typing import Dict, Any

# Get backend URL from frontend .env
BACKEND_URL = "https://5b948487-4ac8-4df0-81a6-d13e8aa6f2bc.preview.emergentagent.com/api"

class BackendTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.session = requests.Session()
        self.test_results = []
        self.project_id = None
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
        
    def test_health_check(self):
        """Test GET /api/health"""
        try:
            response = self.session.get(f"{self.base_url}/health")
            success = response.status_code == 200
            data = response.json() if success else {}
            
            if success and data.get("status") == "healthy":
                self.log_test("Health Check", True, f"Status: {data.get('status')}")
            else:
                self.log_test("Health Check", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
            
    def test_get_tools(self):
        """Test GET /api/tools"""
        try:
            response = self.session.get(f"{self.base_url}/tools")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                tools = data.get("tools", [])
                if len(tools) > 0:
                    self.log_test("Get All Tools", True, f"Found {len(tools)} tools")
                    return tools
                else:
                    self.log_test("Get All Tools", False, "No tools returned")
            else:
                self.log_test("Get All Tools", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Get All Tools", False, f"Exception: {str(e)}")
        return []
        
    def test_tools_by_category(self):
        """Test GET /api/tools/category/{category}"""
        categories = ["Pre-Production", "Production", "Post-Production", "Distribution"]
        
        for category in categories:
            try:
                response = self.session.get(f"{self.base_url}/tools/category/{category}")
                success = response.status_code == 200
                
                if success:
                    data = response.json()
                    tools = data.get("tools", [])
                    self.log_test(f"Tools by Category: {category}", True, f"Found {len(tools)} tools")
                else:
                    self.log_test(f"Tools by Category: {category}", False, f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Tools by Category: {category}", False, f"Exception: {str(e)}")
                
    def test_invalid_category(self):
        """Test GET /api/tools/category/{invalid_category}"""
        try:
            response = self.session.get(f"{self.base_url}/tools/category/InvalidCategory")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                tools = data.get("tools", [])
                if len(tools) == 0:
                    self.log_test("Invalid Category Handling", True, "Correctly returned empty list")
                else:
                    self.log_test("Invalid Category Handling", False, f"Should return empty list, got {len(tools)} tools")
            else:
                self.log_test("Invalid Category Handling", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Invalid Category Handling", False, f"Exception: {str(e)}")
            
    def test_script_writer_execution(self):
        """Test Script Writer tool execution with AI integration"""
        try:
            payload = {
                "tool_name": "Script Writer",
                "inputs": {
                    "prompt": "Write a short dialogue between two characters meeting for the first time in a coffee shop",
                    "system_prompt": "You are a professional screenwriter. Write natural, engaging dialogue."
                }
            }
            
            response = self.session.post(f"{self.base_url}/tools/execute", json=payload)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get("success") and data.get("result"):
                    self.log_test("Script Writer Execution", True, f"Generated script content, execution_id: {data.get('execution_id')}")
                else:
                    self.log_test("Script Writer Execution", False, f"No result generated: {data}")
            else:
                self.log_test("Script Writer Execution", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Script Writer Execution", False, f"Exception: {str(e)}")
            
    def test_brainstorm_ideas_execution(self):
        """Test Brainstorm Ideas tool execution - PRIMARY FOCUS"""
        try:
            payload = {
                "tool_name": "Brainstorm Ideas",
                "inputs": {
                    "prompt": "Generate creative film ideas with a cinematic style",
                    "genre": "cinematic"
                }
            }
            
            response = self.session.post(f"{self.base_url}/tools/execute", json=payload)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get("success") and data.get("result"):
                    result = data.get("result")
                    # Verify it contains expected content for demo mode
                    if "CREATIVE BRAINSTORMING SESSION" in result or "CONCEPT" in result:
                        self.log_test("Brainstorm Ideas Execution", True, f"Generated creative ideas, execution_id: {data.get('execution_id')}, is_demo: {data.get('is_demo')}")
                    else:
                        self.log_test("Brainstorm Ideas Execution", False, f"Result doesn't contain expected brainstorming content: {result[:100]}...")
                else:
                    self.log_test("Brainstorm Ideas Execution", False, f"No result generated: {data}")
            else:
                self.log_test("Brainstorm Ideas Execution", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Brainstorm Ideas Execution", False, f"Exception: {str(e)}")

    def test_brainstorm_ideas_different_genres(self):
        """Test Brainstorm Ideas with different mood/genre inputs"""
        genres = ["general", "cinematic", "intimate", "dark", "comedy", "horror"]
        
        for genre in genres:
            try:
                payload = {
                    "tool_name": "Brainstorm Ideas",
                    "inputs": {
                        "prompt": f"Generate creative film ideas for {genre} style",
                        "genre": genre
                    }
                }
                
                response = self.session.post(f"{self.base_url}/tools/execute", json=payload)
                success = response.status_code == 200
                
                if success:
                    data = response.json()
                    if data.get("success") and data.get("result"):
                        self.log_test(f"Brainstorm Ideas - {genre.title()} Genre", True, f"Generated ideas for {genre} genre")
                    else:
                        self.log_test(f"Brainstorm Ideas - {genre.title()} Genre", False, f"No result for {genre}: {data}")
                else:
                    self.log_test(f"Brainstorm Ideas - {genre.title()} Genre", False, f"Status: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Brainstorm Ideas - {genre.title()} Genre", False, f"Exception: {str(e)}")

    def test_brainstorm_ideas_model_configuration(self):
        """Test that Brainstorm Ideas uses the correct Llama model"""
        try:
            # First get the tools to verify configuration
            response = self.session.get(f"{self.base_url}/tools")
            if response.status_code == 200:
                tools = response.json().get("tools", [])
                brainstorm_tool = next((t for t in tools if t["name"] == "Brainstorm Ideas"), None)
                
                if brainstorm_tool:
                    expected_model = "meta/llama-2-7b-chat:8e6975e5ed6174911a6ff3d60540dfd4844201974602551e10e9e87ab143d81e"
                    actual_model = brainstorm_tool.get("replicate_model")
                    
                    if actual_model == expected_model:
                        self.log_test("Brainstorm Ideas Model Configuration", True, f"Correct model configured: {actual_model}")
                    else:
                        self.log_test("Brainstorm Ideas Model Configuration", False, f"Expected: {expected_model}, Got: {actual_model}")
                        
                    # Verify inputs configuration
                    expected_inputs = {"prompt": "text", "genre": "text"}
                    actual_inputs = brainstorm_tool.get("inputs", {})
                    
                    if actual_inputs == expected_inputs:
                        self.log_test("Brainstorm Ideas Input Configuration", True, f"Correct inputs: {actual_inputs}")
                    else:
                        self.log_test("Brainstorm Ideas Input Configuration", False, f"Expected: {expected_inputs}, Got: {actual_inputs}")
                else:
                    self.log_test("Brainstorm Ideas Model Configuration", False, "Brainstorm Ideas tool not found in tools list")
            else:
                self.log_test("Brainstorm Ideas Model Configuration", False, f"Failed to get tools: {response.status_code}")
                
        except Exception as e:
            self.log_test("Brainstorm Ideas Model Configuration", False, f"Exception: {str(e)}")

    def test_brainstorm_ideas_demo_mode(self):
        """Test that Brainstorm Ideas works in demo mode with placeholder API token"""
        try:
            payload = {
                "tool_name": "Brainstorm Ideas",
                "inputs": {
                    "prompt": "Generate creative film ideas with a cinematic style",
                    "genre": "cinematic"
                }
            }
            
            response = self.session.post(f"{self.base_url}/tools/execute", json=payload)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get("success") and data.get("result"):
                    # Check if it's demo mode and returns expected dummy response
                    is_demo = data.get("is_demo", False)
                    result = data.get("result")
                    
                    if is_demo and "CREATIVE BRAINSTORMING SESSION" in result:
                        self.log_test("Brainstorm Ideas Demo Mode", True, "Demo mode working with expected dummy response")
                    elif not is_demo:
                        self.log_test("Brainstorm Ideas Demo Mode", True, "Live mode detected - API token is configured")
                    else:
                        self.log_test("Brainstorm Ideas Demo Mode", False, f"Demo mode but unexpected response: {result[:100]}...")
                else:
                    self.log_test("Brainstorm Ideas Demo Mode", False, f"No result generated: {data}")
            else:
                self.log_test("Brainstorm Ideas Demo Mode", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Brainstorm Ideas Demo Mode", False, f"Exception: {str(e)}")

    def test_brainstorm_ideas_response_format(self):
        """Test Brainstorm Ideas API response format validation"""
        try:
            payload = {
                "tool_name": "Brainstorm Ideas",
                "inputs": {
                    "prompt": "Generate creative film ideas with a cinematic style",
                    "genre": "cinematic"
                }
            }
            
            response = self.session.post(f"{self.base_url}/tools/execute", json=payload)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                
                # Check required response fields
                required_fields = ["success", "result", "execution_id", "is_demo"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    # Verify field types
                    if (isinstance(data["success"], bool) and 
                        isinstance(data["result"], str) and 
                        isinstance(data["execution_id"], str) and
                        isinstance(data["is_demo"], bool)):
                        self.log_test("Brainstorm Ideas Response Format", True, "All required fields present with correct types")
                    else:
                        self.log_test("Brainstorm Ideas Response Format", False, "Fields present but incorrect types")
                else:
                    self.log_test("Brainstorm Ideas Response Format", False, f"Missing fields: {missing_fields}")
            else:
                self.log_test("Brainstorm Ideas Response Format", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Brainstorm Ideas Response Format", False, f"Exception: {str(e)}")

    def test_brainstorm_ideas_malformed_requests(self):
        """Test Brainstorm Ideas error handling for malformed requests"""
        test_cases = [
            {
                "name": "Missing inputs",
                "payload": {"tool_name": "Brainstorm Ideas"}
            },
            {
                "name": "Missing prompt",
                "payload": {"tool_name": "Brainstorm Ideas", "inputs": {"genre": "cinematic"}}
            },
            {
                "name": "Missing genre", 
                "payload": {"tool_name": "Brainstorm Ideas", "inputs": {"prompt": "test"}}
            },
            {
                "name": "Empty inputs",
                "payload": {"tool_name": "Brainstorm Ideas", "inputs": {}}
            }
        ]
        
        for test_case in test_cases:
            try:
                response = self.session.post(f"{self.base_url}/tools/execute", json=test_case["payload"])
                
                # Should either handle gracefully (200) or return proper error (400/422/500)
                if response.status_code in [200, 400, 422, 500]:
                    if response.status_code == 200:
                        data = response.json()
                        if data.get("success"):
                            self.log_test(f"Brainstorm Ideas Error Handling - {test_case['name']}", True, "Handled gracefully")
                        else:
                            self.log_test(f"Brainstorm Ideas Error Handling - {test_case['name']}", True, "Returned error response")
                    else:
                        self.log_test(f"Brainstorm Ideas Error Handling - {test_case['name']}", True, f"Proper error status: {response.status_code}")
                else:
                    self.log_test(f"Brainstorm Ideas Error Handling - {test_case['name']}", False, f"Unexpected status: {response.status_code}")
                    
            except Exception as e:
                self.log_test(f"Brainstorm Ideas Error Handling - {test_case['name']}", False, f"Exception: {str(e)}")

    def test_character_builder_execution(self):
        """Test Character Builder tool execution with image generation"""
        try:
            payload = {
                "tool_name": "Character Builder",
                "inputs": {
                    "prompt": "A mysterious detective in a noir film, wearing a trench coat and fedora, standing in the rain",
                    "style": "cinematic, film noir, dramatic lighting"
                }
            }
            
            response = self.session.post(f"{self.base_url}/tools/execute", json=payload)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get("success") and data.get("result"):
                    self.log_test("Character Builder Execution", True, f"Generated character image, execution_id: {data.get('execution_id')}")
                else:
                    self.log_test("Character Builder Execution", False, f"No result generated: {data}")
            else:
                self.log_test("Character Builder Execution", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Character Builder Execution", False, f"Exception: {str(e)}")
            
    def test_invalid_tool_execution(self):
        """Test tool execution with invalid tool name"""
        try:
            payload = {
                "tool_name": "NonExistentTool",
                "inputs": {"prompt": "test"}
            }
            
            response = self.session.post(f"{self.base_url}/tools/execute", json=payload)
            success = response.status_code == 404
            
            if success:
                self.log_test("Invalid Tool Error Handling", True, "Correctly returned 404 for invalid tool")
            else:
                self.log_test("Invalid Tool Error Handling", False, f"Expected 404, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Invalid Tool Error Handling", False, f"Exception: {str(e)}")
            
    def test_malformed_tool_request(self):
        """Test tool execution with malformed request"""
        try:
            payload = {
                "invalid_field": "test"
            }
            
            response = self.session.post(f"{self.base_url}/tools/execute", json=payload)
            success = response.status_code in [400, 422]  # Bad request or validation error
            
            if success:
                self.log_test("Malformed Request Handling", True, f"Correctly returned {response.status_code} for malformed request")
            else:
                self.log_test("Malformed Request Handling", False, f"Expected 400/422, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Malformed Request Handling", False, f"Exception: {str(e)}")
            
    def test_create_project(self):
        """Test POST /api/projects"""
        try:
            payload = {
                "name": "Epic Sci-Fi Adventure",
                "description": "A thrilling space adventure featuring alien worlds and advanced technology",
                "tools_used": ["Script Writer", "Character Builder", "Environment Builder"]
            }
            
            response = self.session.post(f"{self.base_url}/projects", json=payload)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get("success") and data.get("project"):
                    project = data["project"]
                    self.project_id = project.get("id")
                    self.log_test("Create Project", True, f"Created project: {project.get('name')}, ID: {self.project_id}")
                else:
                    self.log_test("Create Project", False, f"No project data returned: {data}")
            else:
                self.log_test("Create Project", False, f"Status: {response.status_code}, Response: {response.text}")
                
        except Exception as e:
            self.log_test("Create Project", False, f"Exception: {str(e)}")
            
    def test_get_projects(self):
        """Test GET /api/projects"""
        try:
            response = self.session.get(f"{self.base_url}/projects")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                projects = data.get("projects", [])
                self.log_test("Get Projects", True, f"Retrieved {len(projects)} projects")
            else:
                self.log_test("Get Projects", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Get Projects", False, f"Exception: {str(e)}")
            
    def test_get_project_by_id(self):
        """Test GET /api/projects/{project_id}"""
        if not self.project_id:
            self.log_test("Get Project by ID", False, "No project ID available from previous test")
            return
            
        try:
            response = self.session.get(f"{self.base_url}/projects/{self.project_id}")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                project = data.get("project")
                executions = data.get("executions", [])
                if project:
                    self.log_test("Get Project by ID", True, f"Retrieved project: {project.get('name')}, {len(executions)} executions")
                else:
                    self.log_test("Get Project by ID", False, "No project data returned")
            else:
                self.log_test("Get Project by ID", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Get Project by ID", False, f"Exception: {str(e)}")
            
    def test_invalid_project_id(self):
        """Test GET /api/projects/{invalid_id}"""
        try:
            fake_id = str(uuid.uuid4())
            response = self.session.get(f"{self.base_url}/projects/{fake_id}")
            success = response.status_code == 404
            
            if success:
                self.log_test("Invalid Project ID Handling", True, "Correctly returned 404 for invalid project ID")
            else:
                self.log_test("Invalid Project ID Handling", False, f"Expected 404, got {response.status_code}")
                
        except Exception as e:
            self.log_test("Invalid Project ID Handling", False, f"Exception: {str(e)}")
            
    def test_replicate_connection(self):
        """Test GET /api/test-replicate"""
        try:
            response = self.session.get(f"{self.base_url}/test-replicate")
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get("success"):
                    self.log_test("Replicate API Connection", True, "Replicate API is working")
                else:
                    self.log_test("Replicate API Connection", False, f"Replicate error: {data.get('error')}")
            else:
                self.log_test("Replicate API Connection", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Replicate API Connection", False, f"Exception: {str(e)}")
            
    def test_tool_execution_with_project(self):
        """Test tool execution with project association"""
        if not self.project_id:
            self.log_test("Tool Execution with Project", False, "No project ID available")
            return
            
        try:
            payload = {
                "tool_name": "Environment Builder",
                "inputs": {
                    "prompt": "A futuristic cityscape with flying cars and neon lights",
                    "aspect_ratio": "16:9"
                },
                "project_id": self.project_id
            }
            
            response = self.session.post(f"{self.base_url}/tools/execute", json=payload)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                if data.get("success") and data.get("result"):
                    self.log_test("Tool Execution with Project", True, f"Executed tool for project {self.project_id}")
                else:
                    self.log_test("Tool Execution with Project", False, f"No result generated: {data}")
            else:
                self.log_test("Tool Execution with Project", False, f"Status: {response.status_code}")
                
        except Exception as e:
            self.log_test("Tool Execution with Project", False, f"Exception: {str(e)}")
            
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting AI Filmmaking Platform Backend API Tests")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Core API Tests
        self.test_health_check()
        self.test_get_tools()
        self.test_tools_by_category()
        self.test_invalid_category()
        
        # Tool Execution Tests
        print("\n🔧 Testing Tool Execution...")
        self.test_script_writer_execution()
        self.test_character_builder_execution()
        self.test_invalid_tool_execution()
        self.test_malformed_tool_request()
        
        # Project Management Tests
        print("\n📁 Testing Project Management...")
        self.test_create_project()
        self.test_get_projects()
        self.test_get_project_by_id()
        self.test_invalid_project_id()
        
        # AI Integration Tests
        print("\n🤖 Testing AI Integration...")
        self.test_replicate_connection()
        self.test_tool_execution_with_project()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['details']}")
                    
        return passed == total

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! Backend is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the details above.")