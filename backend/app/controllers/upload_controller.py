from flask import Blueprint, request
from app.utils.supabase_client import get_supabase_admin
from app.utils.response import success_response, error_response
from app.utils.auth import require_admin
import os
import uuid
from datetime import datetime

upload_bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/image', methods=['POST'])
@require_admin
def upload_image():
    """Upload image to Supabase Storage"""
    try:
        # Check if file is present
        if 'file' not in request.files:
            return error_response('No file provided', status_code=400)
        
        file = request.files['file']
        
        # Check if file is selected
        if file.filename == '':
            return error_response('No file selected', status_code=400)
        
        # Check file extension
        if not allowed_file(file.filename):
            return error_response('Invalid file type. Allowed: PNG, JPG, JPEG, GIF, WEBP', status_code=400)
        
        # Check file size
        file.seek(0, os.SEEK_END)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > MAX_FILE_SIZE:
            return error_response('File too large. Maximum size: 5MB', status_code=400)
        
        # Read file content
        file_content = file.read()
        
        # Generate unique filename
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # Get upload type (product, game, avatar, etc.)
        upload_type = request.form.get('type', 'product')
        
        # Create folder path based on type
        folder_path = f"{upload_type}s/{datetime.now().strftime('%Y/%m')}"
        file_path = f"{folder_path}/{unique_filename}"
        
        print(f"📤 Uploading image: {file_path}")
        print(f"   File size: {file_size} bytes")
        print(f"   Content type: {file.content_type}")
        
        # Upload to Supabase Storage
        supabase = get_supabase_admin()
        
        # Upload file to 'images' bucket
        response = supabase.storage.from_('images').upload(
            file_path,
            file_content,
            {
                'content-type': file.content_type or f'image/{file_extension}',
                'cache-control': '3600',
                'upsert': 'false'
            }
        )
        
        print(f"✅ Upload response: {response}")
        
        # Get public URL
        public_url = supabase.storage.from_('images').get_public_url(file_path)
        
        print(f"✅ Public URL: {public_url}")
        
        return success_response({
            'url': public_url,
            'path': file_path,
            'filename': unique_filename,
            'size': file_size,
            'type': upload_type
        }, 'Image uploaded successfully')
        
    except Exception as e:
        print(f"❌ Upload error: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Upload failed: {str(e)}', status_code=500)

@upload_bp.route('/image/<path:file_path>', methods=['DELETE'])
@require_admin
def delete_image(file_path):
    """Delete image from Supabase Storage"""
    try:
        supabase = get_supabase_admin()
        
        # Delete file from storage
        response = supabase.storage.from_('images').remove([file_path])
        
        print(f"✅ Deleted image: {file_path}")
        
        return success_response(message='Image deleted successfully')
        
    except Exception as e:
        print(f"❌ Delete error: {str(e)}")
        return error_response(f'Delete failed: {str(e)}', status_code=500)
