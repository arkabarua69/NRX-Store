"""
Test configuration and fixtures for notification tests
"""
import pytest
import os
from app import create_app
from app.utils.supabase_client import get_supabase_admin


@pytest.fixture
def app():
    """Create and configure a test Flask application"""
    app = create_app()
    app.config['TESTING'] = True
    return app


@pytest.fixture
def client(app):
    """Create a test client for the Flask application"""
    return app.test_client()


@pytest.fixture
def supabase():
    """Get Supabase admin client for test setup"""
    return get_supabase_admin()


@pytest.fixture
def admin_user(supabase):
    """
    Get or create an admin user for testing
    Returns a dict with user_id and auth_token
    """
    # Use the admin credentials from .env
    admin_email = os.getenv('ADMIN_EMAIL', 'gunjonarka@gmail.com')
    admin_password = os.getenv('ADMIN_PASSWORD', 'mac00129')
    
    try:
        # Try to sign in
        auth_response = supabase.auth.sign_in_with_password({
            "email": admin_email,
            "password": admin_password
        })
        
        return {
            'user_id': auth_response.user.id,
            'email': auth_response.user.email,
            'token': auth_response.session.access_token
        }
    except Exception as e:
        # If sign in fails, we'll skip tests that require auth
        pytest.skip(f"Admin user not available for testing: {str(e)}")


@pytest.fixture
def regular_user(supabase):
    """
    Get or create a regular user for testing
    Returns a dict with user_id and auth_token
    """
    regular_email = os.getenv('TEST_USER_EMAIL', 'user@test.com')
    regular_password = os.getenv('TEST_USER_PASSWORD', 'testpassword123')
    
    try:
        # Try to sign in
        auth_response = supabase.auth.sign_in_with_password({
            "email": regular_email,
            "password": regular_password
        })
        
        return {
            'user_id': auth_response.user.id,
            'email': auth_response.user.email,
            'token': auth_response.session.access_token
        }
    except Exception as e:
        # If sign in fails, we'll skip tests that require auth
        pytest.skip(f"Regular user not available for testing: {str(e)}")
