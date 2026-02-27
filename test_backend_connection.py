#!/usr/bin/env python3
"""
Quick script to test backend API connectivity and CORS configuration
"""
import requests
import json

BACKEND_URL = "https://nrx-store.onrender.com"
FRONTEND_ORIGIN = "https://nrx-store.vercel.app"

def test_health():
    """Test backend health endpoint"""
    print("🔍 Testing backend health...")
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=10)
        print(f"✅ Health check: {response.status_code}")
        print(f"   Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_cors():
    """Test CORS configuration"""
    print("\n🔍 Testing CORS configuration...")
    headers = {
        'Origin': FRONTEND_ORIGIN,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
    }
    try:
        # OPTIONS preflight request
        response = requests.options(f"{BACKEND_URL}/api/products", headers=headers, timeout=10)
        print(f"✅ CORS preflight: {response.status_code}")
        print(f"   Access-Control-Allow-Origin: {response.headers.get('Access-Control-Allow-Origin')}")
        print(f"   Access-Control-Allow-Methods: {response.headers.get('Access-Control-Allow-Methods')}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ CORS test failed: {e}")
        return False

def test_api_endpoints():
    """Test various API endpoints"""
    print("\n🔍 Testing API endpoints...")
    
    endpoints = [
        "/api/products?onlyActive=true",
        "/api/settings",
        "/api/reviews",
        "/api/stats/platform-stats"
    ]
    
    results = []
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BACKEND_URL}{endpoint}", timeout=10)
            status = "✅" if response.status_code in [200, 401, 403] else "❌"
            print(f"{status} {endpoint}: {response.status_code}")
            results.append(response.status_code != 404)
        except Exception as e:
            print(f"❌ {endpoint}: {e}")
            results.append(False)
    
    return all(results)

def test_with_origin():
    """Test API call with Origin header (simulating frontend request)"""
    print("\n🔍 Testing API with Origin header...")
    headers = {'Origin': FRONTEND_ORIGIN}
    try:
        response = requests.get(f"{BACKEND_URL}/api/products?onlyActive=true", headers=headers, timeout=10)
        print(f"✅ Products endpoint: {response.status_code}")
        print(f"   Access-Control-Allow-Origin: {response.headers.get('Access-Control-Allow-Origin')}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Products count: {len(data.get('products', []))}")
        return True
    except Exception as e:
        print(f"❌ API test failed: {e}")
        return False

def main():
    print("=" * 60)
    print("🚀 Backend Connection Test")
    print(f"Backend: {BACKEND_URL}")
    print(f"Frontend Origin: {FRONTEND_ORIGIN}")
    print("=" * 60)
    
    results = {
        'health': test_health(),
        'cors': test_cors(),
        'endpoints': test_api_endpoints(),
        'with_origin': test_with_origin()
    }
    
    print("\n" + "=" * 60)
    print("📊 Test Results Summary")
    print("=" * 60)
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name.upper()}: {status}")
    
    all_passed = all(results.values())
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 All tests passed! Backend is configured correctly.")
    else:
        print("⚠️  Some tests failed. Check the configuration above.")
    print("=" * 60)

if __name__ == "__main__":
    main()
