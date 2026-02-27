from flask import Blueprint, request
from app.utils.supabase_client import get_supabase
from app.utils.response import success_response, error_response
from app.utils.auth import require_admin

faq_bp = Blueprint('faq', __name__)

@faq_bp.route('', methods=['GET'])
def get_all_faqs():
    """Get all active FAQs"""
    try:
        supabase = get_supabase()
        
        # Get category filter if provided
        category = request.args.get('category')
        
        query = supabase.table('faqs').select('*').eq('is_active', True)
        
        if category and category != 'all':
            query = query.eq('category', category)
        
        response = query.order('order_index').execute()
        
        # Transform to match frontend interface
        faqs = []
        for faq in response.data:
            faqs.append({
                'id': faq['id'],
                'question': faq['question'],
                'questionBn': faq['question_bn'],
                'answer': faq['answer'],
                'answerBn': faq['answer_bn'],
                'category': faq['category'],
                'order': faq['order_index'],
                'isActive': faq['is_active'],
                'createdAt': faq.get('created_at'),
                'updatedAt': faq.get('updated_at')
            })
        
        return success_response(faqs)
        
    except Exception as e:
        print(f"❌ Error fetching FAQs: {str(e)}")
        return error_response(f'Error fetching FAQs: {str(e)}', status_code=500)

@faq_bp.route('/<faq_id>', methods=['GET'])
def get_faq(faq_id):
    """Get single FAQ by ID"""
    try:
        supabase = get_supabase()
        response = supabase.table('faqs').select('*').eq('id', faq_id).eq('is_active', True).execute()
        
        if not response.data:
            return error_response('FAQ not found', status_code=404)
        
        faq = response.data[0]
        return success_response({
            'id': faq['id'],
            'question': faq['question'],
            'questionBn': faq['question_bn'],
            'answer': faq['answer'],
            'answerBn': faq['answer_bn'],
            'category': faq['category'],
            'order': faq['order_index'],
            'isActive': faq['is_active'],
            'createdAt': faq.get('created_at'),
            'updatedAt': faq.get('updated_at')
        })
        
    except Exception as e:
        print(f"❌ Error fetching FAQ: {str(e)}")
        return error_response(f'Error fetching FAQ: {str(e)}', status_code=500)

@faq_bp.route('', methods=['POST'])
@require_admin
def create_faq():
    """Create new FAQ (Admin only)"""
    try:
        data = request.get_json()
        supabase = get_supabase()
        
        faq_data = {
            'question': data.get('question'),
            'question_bn': data.get('questionBn'),
            'answer': data.get('answer'),
            'answer_bn': data.get('answerBn'),
            'category': data.get('category', 'general'),
            'order_index': data.get('order', 0),
            'is_active': data.get('isActive', True)
        }
        
        response = supabase.table('faqs').insert(faq_data).execute()
        
        print(f"✅ FAQ created: {data.get('question')}")
        return success_response(response.data[0], 'FAQ created successfully', 201)
        
    except Exception as e:
        print(f"❌ Error creating FAQ: {str(e)}")
        return error_response(f'Error creating FAQ: {str(e)}', status_code=500)

@faq_bp.route('/<faq_id>', methods=['PUT'])
@require_admin
def update_faq(faq_id):
    """Update FAQ (Admin only)"""
    try:
        data = request.get_json()
        supabase = get_supabase()
        
        update_data = {}
        if 'question' in data:
            update_data['question'] = data['question']
        if 'questionBn' in data:
            update_data['question_bn'] = data['questionBn']
        if 'answer' in data:
            update_data['answer'] = data['answer']
        if 'answerBn' in data:
            update_data['answer_bn'] = data['answerBn']
        if 'category' in data:
            update_data['category'] = data['category']
        if 'order' in data:
            update_data['order_index'] = data['order']
        if 'isActive' in data:
            update_data['is_active'] = data['isActive']
        
        response = supabase.table('faqs').update(update_data).eq('id', faq_id).execute()
        
        if not response.data:
            return error_response('FAQ not found', status_code=404)
        
        print(f"✅ FAQ updated: {faq_id}")
        return success_response(response.data[0], 'FAQ updated successfully')
        
    except Exception as e:
        print(f"❌ Error updating FAQ: {str(e)}")
        return error_response(f'Error updating FAQ: {str(e)}', status_code=500)

@faq_bp.route('/<faq_id>', methods=['DELETE'])
@require_admin
def delete_faq(faq_id):
    """Delete FAQ (Admin only)"""
    try:
        supabase = get_supabase()
        response = supabase.table('faqs').delete().eq('id', faq_id).execute()
        
        if not response.data:
            return error_response('FAQ not found', status_code=404)
        
        print(f"✅ FAQ deleted: {faq_id}")
        return success_response(message='FAQ deleted successfully')
        
    except Exception as e:
        print(f"❌ Error deleting FAQ: {str(e)}")
        return error_response(f'Error deleting FAQ: {str(e)}', status_code=500)
