from supabase import create_client, Client
from app.config import Config

class SupabaseClient:
    _instance: Client = None
    _service_instance: Client = None
    
    @classmethod
    def get_client(cls) -> Client:
        """Get Supabase client with anon key (for public operations)"""
        if cls._instance is None:
            cls._instance = create_client(
                Config.SUPABASE_URL,
                Config.SUPABASE_KEY
            )
        return cls._instance
    
    @classmethod
    def get_service_client(cls) -> Client:
        """Get Supabase client with service role key (for admin operations)"""
        if cls._service_instance is None:
            cls._service_instance = create_client(
                Config.SUPABASE_URL,
                Config.SUPABASE_SERVICE_KEY
            )
        return cls._service_instance

# Convenience functions
def get_supabase() -> Client:
    return SupabaseClient.get_client()

def get_supabase_admin() -> Client:
    return SupabaseClient.get_service_client()
