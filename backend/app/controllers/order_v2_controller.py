from flask import Blueprint, request, jsonify
from app.utils.supabase_client import get_supabase, get_supabase_admin
from app.utils.response import success_response, error_response
from app.utils.auth import require_auth
from datetime import datetime
import uuid

order_v2_bp = Blueprint('orders_v2', __name__)

@order_v2_bp.route('/create', methods=['POST'])
@require_auth
def create_order_v2():
    """Create order - Version 2 with direct database access"""
    try:
        data = request.get_json()
        user = request.current_user
        
        print("=" * 50)
        print("ORDER V2 - CREATE START")
        print(f"User: {user.id}")
        print(f"Data: {data}")
        print("=" * 50)
        
        # Validate
        if not data.get('product_id'):
            return error_response('Product ID required', 400)
        if not data.get('player_id'):
            return error_response('Player ID required', 400)
        
        # Get product
        supabase = get_supabase()
        product_result = supabase.table('topup_packages').select('*').eq('id', data['product_id']).execute()
        
        print(f"Product query result: {product_result}")
        
        if not product_result.data or len(product_result.data) == 0:
            return error_response('Product not found', 404)
        
        product = product_result.data[0]
        print(f"Product: {product['name']}, Price: {product['price']}")
        
        # Calculate
        quantity = data.get('quantity', 1)
        total = float(product['price']) * quantity
        order_id = str(uuid.uuid4())
        
        # Prepare order data - MINIMAL FIELDS
        order_data = {
            'user_id': user.id,
            'product_id': data['product_id'],
            'quantity': quantity,
            'unit_price': float(product['price']),
            'total_amount': total,
            'player_id': data['player_id']
        }
        
        print(f"Inserting order: {order_data}")
        
        # Use ADMIN client
        admin = get_supabase_admin()
        insert_result = admin.table('orders').insert(order_data).execute()
        
        print(f"Insert result: {insert_result}")
        print(f"Insert data: {insert_result.data}")
        
        if insert_result.data and len(insert_result.data) > 0:
            created_order = insert_result.data[0]
            print(f"SUCCESS! Order ID: {created_order['id']}")
            return jsonify({
                'success': True,
                'data': created_order,
                'message': 'Order created'
            }), 201
        else:
            print("FAILED - No data returned")
            return error_response('Insert returned no data', 500)
            
    except Exception as e:
        print("=" * 50)
        print("ORDER V2 - ERROR")
        print(f"Error: {str(e)}")
        import traceback
        print(traceback.format_exc())
        print("=" * 50)
        return error_response(f'Error: {str(e)}', 500)


@order_v2_bp.route('/<order_id>/proof', methods=['POST'])
@require_auth
def upload_proof_v2(order_id):
    """Upload payment proof - Version 2"""
    try:
        data = request.get_json()
        user = request.current_user
        
        print(f"Uploading proof for order: {order_id}")
        
        # Verify ownership
        supabase = get_supabase()
        order_result = supabase.table('orders').select('*').eq('id', order_id).execute()
        
        if not order_result.data or len(order_result.data) == 0:
            return error_response('Order not found', 404)
        
        order = order_result.data[0]
        if order['user_id'] != user.id:
            return error_response('Access denied', 403)
        
        # Update with admin client
        admin = get_supabase_admin()
        update_data = {
            'payment_proof_url': data.get('proof_url'),
            'payment_method': data.get('payment_method'),
            'transaction_id': data.get('transaction_id'),
            'payment_status': 'paid',
            'status': 'processing'
        }
        
        print(f"Updating order with: {update_data}")
        
        update_result = admin.table('orders').update(update_data).eq('id', order_id).execute()
        
        if update_result.data and len(update_result.data) > 0:
            return jsonify({
                'success': True,
                'data': update_result.data[0],
                'message': 'Proof uploaded'
            }), 200
        else:
            return error_response('Update failed', 500)
            
    except Exception as e:
        print(f"Proof upload error: {str(e)}")
        import traceback
        print(traceback.format_exc())
        return error_response(f'Error: {str(e)}', 500)
