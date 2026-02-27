from flask import jsonify
from typing import Any, Optional

def success_response(data: Any = None, message: str = 'Success', status_code: int = 200):
    """Standard success response"""
    response = {
        'success': True,
        'message': message
    }
    if data is not None:
        response['data'] = data
    return jsonify(response), status_code

def error_response(message: str = 'Error', details: Optional[Any] = None, status_code: int = 400):
    """Standard error response"""
    response = {
        'success': False,
        'error': message
    }
    if details is not None:
        response['details'] = details
    return jsonify(response), status_code

def paginated_response(data: list, page: int, page_size: int, total: int, status_code: int = 200):
    """Paginated response"""
    return jsonify({
        'success': True,
        'data': data,
        'pagination': {
            'page': page,
            'page_size': page_size,
            'total': total,
            'total_pages': (total + page_size - 1) // page_size
        }
    }), status_code
