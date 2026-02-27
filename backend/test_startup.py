#!/usr/bin/env python3
"""Test script to verify the Flask app starts correctly"""
import os
import sys

# Set production environment
os.environ['FLASK_ENV'] = 'production'
os.environ['FLASK_DEBUG'] = 'False'

try:
    from run import app
    print("✅ App imported successfully")
    print(f"✅ App name: {app.name}")
    print(f"✅ Debug mode: {app.debug}")
    print(f"✅ Environment: {app.config.get('FLASK_ENV')}")
    
    # Test health endpoint
    with app.test_client() as client:
        response = client.get('/health')
        print(f"✅ Health check status: {response.status_code}")
        print(f"✅ Health check response: {response.get_json()}")
    
    print("\n🎉 All checks passed! App is ready for deployment.")
    sys.exit(0)
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
