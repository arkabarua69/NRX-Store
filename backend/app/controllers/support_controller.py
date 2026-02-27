from flask import Blueprint, request
from app.utils.supabase_client import get_supabase
from app.utils.response import success_response, error_response
from app.utils.auth import require_admin
from datetime import datetime

support_bp = Blueprint('support', __name__)

@support_bp.route('', methods=['POST'])
def create_support_ticket():
    """Create a new support ticket"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('email') or not data.get('subject') or not data.get('message'):
            return error_response('Name, email, subject, and message are required', status_code=400)
        
        supabase = get_supabase()
        
        ticket_data = {
            'name': data.get('name'),
            'email': data.get('email'),
            'phone': data.get('phone', ''),
            'subject': data.get('subject'),
            'message': data.get('message'),
            'category': data.get('category', 'general'),
            'status': 'open',
            'priority': 'normal'
        }
        
        response = supabase.table('support_tickets').insert(ticket_data).execute()
        
        if response.data:
            ticket = response.data[0]
            print(f"✅ Support ticket created: {ticket.get('ticket_number')}")
            
            return success_response({
                'id': ticket['id'],
                'ticketNumber': ticket['ticket_number'],
                'status': ticket['status'],
                'createdAt': ticket['created_at']
            }, 'Support ticket created successfully', 201)
        else:
            return error_response('Failed to create support ticket', status_code=500)
        
    except Exception as e:
        print(f"❌ Error creating support ticket: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Error creating support ticket: {str(e)}', status_code=500)

@support_bp.route('', methods=['GET'])
@require_admin
def get_all_tickets():
    """Get all support tickets (Admin only)"""
    try:
        supabase = get_supabase()
        
        # Get filters from query params
        status = request.args.get('status')
        category = request.args.get('category')
        
        query = supabase.table('support_tickets').select('*')
        
        if status and status != 'all':
            query = query.eq('status', status)
        
        if category and category != 'all':
            query = query.eq('category', category)
        
        response = query.order('created_at', desc=True).execute()
        
        # Transform to camelCase for frontend
        tickets = []
        for ticket in response.data:
            tickets.append({
                'id': ticket['id'],
                'ticketNumber': ticket['ticket_number'],
                'name': ticket['name'],
                'email': ticket['email'],
                'phone': ticket.get('phone'),
                'subject': ticket['subject'],
                'message': ticket['message'],
                'category': ticket['category'],
                'status': ticket['status'],
                'priority': ticket['priority'],
                'adminReply': ticket.get('admin_reply'),
                'adminNotes': ticket.get('admin_notes'),
                'assignedTo': ticket.get('assigned_to'),
                'repliedAt': ticket.get('replied_at'),
                'repliedBy': ticket.get('replied_by'),
                'createdAt': ticket['created_at'],
                'updatedAt': ticket['updated_at'],
                'resolvedAt': ticket.get('resolved_at')
            })
        
        print(f"✅ Fetched {len(tickets)} support tickets")
        return success_response(tickets)
        
    except Exception as e:
        print(f"❌ Error fetching support tickets: {str(e)}")
        return error_response(f'Error fetching support tickets: {str(e)}', status_code=500)

@support_bp.route('/<ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    """Get single support ticket"""
    try:
        supabase = get_supabase()
        response = supabase.table('support_tickets').select('*').eq('id', ticket_id).execute()
        
        if not response.data:
            return error_response('Support ticket not found', status_code=404)
        
        ticket = response.data[0]
        return success_response({
            'id': ticket['id'],
            'ticketNumber': ticket['ticket_number'],
            'name': ticket['name'],
            'email': ticket['email'],
            'phone': ticket.get('phone'),
            'subject': ticket['subject'],
            'message': ticket['message'],
            'category': ticket['category'],
            'status': ticket['status'],
            'priority': ticket['priority'],
            'adminReply': ticket.get('admin_reply'),
            'adminNotes': ticket.get('admin_notes'),
            'createdAt': ticket['created_at'],
            'updatedAt': ticket['updated_at']
        })
        
    except Exception as e:
        print(f"❌ Error fetching support ticket: {str(e)}")
        return error_response(f'Error fetching support ticket: {str(e)}', status_code=500)

@support_bp.route('/<ticket_id>/reply', methods=['POST'])
@require_admin
def reply_to_ticket(ticket_id):
    """Reply to a support ticket (Admin only)"""
    try:
        data = request.get_json()
        user = request.current_user
        
        if not data.get('reply'):
            return error_response('Reply message is required', status_code=400)
        
        supabase = get_supabase()
        
        update_data = {
            'admin_reply': data.get('reply'),
            'admin_notes': data.get('notes', ''),
            'status': data.get('status', 'in_progress'),
            'replied_at': datetime.utcnow().isoformat(),
            'replied_by': user.id
        }
        
        response = supabase.table('support_tickets').update(update_data).eq('id', ticket_id).execute()
        
        if not response.data:
            return error_response('Support ticket not found', status_code=404)
        
        print(f"✅ Admin replied to ticket: {ticket_id}")
        return success_response(response.data[0], 'Reply sent successfully')
        
    except Exception as e:
        print(f"❌ Error replying to ticket: {str(e)}")
        return error_response(f'Error replying to ticket: {str(e)}', status_code=500)

@support_bp.route('/<ticket_id>/status', methods=['PATCH'])
@require_admin
def update_ticket_status(ticket_id):
    """Update ticket status (Admin only)"""
    try:
        data = request.get_json()
        
        if not data.get('status'):
            return error_response('Status is required', status_code=400)
        
        supabase = get_supabase()
        
        update_data = {
            'status': data.get('status')
        }
        
        if data.get('priority'):
            update_data['priority'] = data.get('priority')
        
        response = supabase.table('support_tickets').update(update_data).eq('id', ticket_id).execute()
        
        if not response.data:
            return error_response('Support ticket not found', status_code=404)
        
        print(f"✅ Ticket status updated: {ticket_id} -> {data.get('status')}")
        return success_response(response.data[0], 'Status updated successfully')
        
    except Exception as e:
        print(f"❌ Error updating ticket status: {str(e)}")
        return error_response(f'Error updating ticket status: {str(e)}', status_code=500)

@support_bp.route('/<ticket_id>', methods=['DELETE'])
@require_admin
def delete_ticket(ticket_id):
    """Delete support ticket (Admin only)"""
    try:
        supabase = get_supabase()
        response = supabase.table('support_tickets').delete().eq('id', ticket_id).execute()
        
        if not response.data:
            return error_response('Support ticket not found', status_code=404)
        
        print(f"✅ Support ticket deleted: {ticket_id}")
        return success_response(message='Support ticket deleted successfully')
        
    except Exception as e:
        print(f"❌ Error deleting support ticket: {str(e)}")
        return error_response(f'Error deleting support ticket: {str(e)}', status_code=500)

@support_bp.route('/stats', methods=['GET'])
@require_admin
def get_support_stats():
    """Get support ticket statistics (Admin only)"""
    try:
        supabase = get_supabase()
        
        # Get all tickets
        all_tickets = supabase.table('support_tickets').select('*', count='exact').execute()
        
        # Get by status
        open_tickets = supabase.table('support_tickets').select('*', count='exact').eq('status', 'open').execute()
        in_progress = supabase.table('support_tickets').select('*', count='exact').eq('status', 'in_progress').execute()
        resolved = supabase.table('support_tickets').select('*', count='exact').eq('status', 'resolved').execute()
        
        stats = {
            'total': all_tickets.count or 0,
            'open': open_tickets.count or 0,
            'inProgress': in_progress.count or 0,
            'resolved': resolved.count or 0
        }
        
        return success_response(stats)
        
    except Exception as e:
        print(f"❌ Error fetching support stats: {str(e)}")
        return error_response(f'Error fetching support stats: {str(e)}', status_code=500)
