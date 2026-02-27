from flask import Blueprint, request, jsonify
from app.utils.supabase_client import get_supabase
from app.utils.response import success_response, error_response
from app.utils.auth import require_auth
from datetime import datetime
import uuid

simple_order_bp = Blueprint('simple_orders', __name__)

@simple_order_bp.route('', methods=['POST'])
@require_auth
def create_simple_order():
    """Create a new order with simplified schema"""
    try:
        data = request.get_json()
        user = request.current_user
        supabase = get_supabase()
        
        # Validate required fields
        if not data.get('product_id'):
            return error_response('Product ID is required', status_code=400)
        
        if not data.get('player_id'):
            return error_response('Player ID is required', status_code=400)
        
        # Get product details
        product_response = supabase.table('topup_packages').select('*').eq('id', data['product_id']).single().execute()
        
        if not product_response.data:
            return error_response('Product not found', status_code=404)
        
        product = product_response.data
        
        if not product.get('is_active'):
            return error_response('Product is not available', status_code=400)
        
        # Calculate total
        quantity = data.get('quantity', 1)
        total_amount = product['price'] * quantity
        
        # Create order with only the fields that exist in the database
        order_id = str(uuid.uuid4())
        order_data = {
            'id': order_id,
            'user_id': user.id,
            'product_id': data['product_id'],
            'quantity': quantity,
            'unit_price': float(product['price']),
            'total_amount': float(total_amount),
            'currency': product.get('currency', 'BDT'),
            'status': 'pending',
            'payment_status': 'pending',
            'player_id': data['player_id'],
            'player_name': data.get('player_name', ''),
            'verification_status': 'pending'
        }
        
        # Add optional fields if provided
        if data.get('notes'):
            order_data['notes'] = data['notes']
        
        print(f"Creating order with data: {order_data}")
        
        # Insert order
        try:
            response = supabase.table('orders').insert(order_data).execute()
            
            if response.data and len(response.data) > 0:
                return success_response(response.data[0], 'Order created successfully', 201)
            else:
                print(f"Insert response: {response}")
                return error_response('Failed to create order - no data returned', status_code=500)
        except Exception as insert_error:
            print(f"Insert error: {str(insert_error)}")
            return error_response(f'Database error: {str(insert_error)}', status_code=500)
        
    except Exception as e:
        print(f"Error creating order: {str(e)}")
        return error_response(f'Error creating order: {str(e)}', status_code=500)


@simple_order_bp.route('/<order_id>/upload-proof', methods=['POST'])
@require_auth
def upload_proof(order_id):
    """Upload payment proof for an order"""
    try:
        data = request.get_json()
        user = request.current_user
        supabase = get_supabase()
        
        # Verify order exists and belongs to user
        order_response = supabase.table('orders').select('*').eq('id', order_id).single().execute()
        
        if not order_response.data:
            return error_response('Order not found', status_code=404)
        
        order = order_response.data
        
        if order['user_id'] != user.id:
            return error_response('Access denied', status_code=403)
        
        # Update order with payment proof
        update_data = {
            'payment_proof_url': data.get('imageUrl'),
            'payment_method': data.get('paymentMethod', ''),
            'transaction_id': data.get('transactionId', ''),
            'payment_status': 'paid',
            'status': 'processing'
        }
        
        print(f"Updating order {order_id} with: {update_data}")
        
        try:
            response = supabase.table('orders').update(update_data).eq('id', order_id).execute()
            
            if response.data and len(response.data) > 0:
                return success_response(response.data[0], 'Payment proof uploaded successfully')
            else:
                print(f"Update response: {response}")
                return error_response('Failed to upload payment proof - no data returned', status_code=500)
        except Exception as update_error:
            print(f"Update error: {str(update_error)}")
            return error_response(f'Database error: {str(update_error)}', status_code=500)
        
    except Exception as e:
        print(f"Error uploading payment proof: {str(e)}")
        return error_response(f'Error uploading payment proof: {str(e)}', status_code=500)
