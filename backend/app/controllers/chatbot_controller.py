from flask import Blueprint, request
from app.utils.response import success_response, error_response
from app.ai.chatbot_brain import chatbot_brain

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('', methods=['POST'])
def chat():
    """Handle chatbot conversation"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return error_response('Message is required', status_code=400)
        
        user_message = data.get('message', '').strip()
        context = data.get('context', {})
        previous_messages = context.get('previousMessages', [])
        
        if not user_message:
            return error_response('Message cannot be empty', status_code=400)
        
        print(f"💬 User message: {user_message}")
        
        # Get AI response
        bot_response = chatbot_brain.get_context_aware_response(
            user_message, 
            previous_messages
        )
        
        print(f"🤖 Bot response: {bot_response}")
        
        return success_response({
            'response': bot_response,
            'intent': chatbot_brain.conversation_state,
            'timestamp': chatbot_brain.context_memory[-1]['timestamp'] if chatbot_brain.context_memory else None
        })
        
    except Exception as e:
        print(f"❌ Chatbot error: {str(e)}")
        import traceback
        traceback.print_exc()
        return error_response(f'Chatbot error: {str(e)}', status_code=500)

@chatbot_bp.route('/feedback', methods=['POST'])
def feedback():
    """Handle user feedback for reinforcement learning"""
    try:
        data = request.get_json()
        
        if not data or 'rating' not in data:
            return error_response('Rating is required', status_code=400)
        
        rating = float(data.get('rating', 0.5))
        
        # Normalize rating to 0-1 range
        reward = max(0, min(1, rating))
        
        # Update RL model
        chatbot_brain.update_reward(reward)
        
        print(f"✅ Feedback received: {reward}")
        
        return success_response({
            'message': 'Feedback received',
            'reward': reward
        })
        
    except Exception as e:
        print(f"❌ Feedback error: {str(e)}")
        return error_response(f'Feedback error: {str(e)}', status_code=500)

@chatbot_bp.route('/stats', methods=['GET'])
def stats():
    """Get chatbot statistics"""
    try:
        return success_response({
            'total_conversations': len(chatbot_brain.context_memory),
            'current_state': chatbot_brain.conversation_state,
            'q_table_size': len(chatbot_brain.q_table),
            'templates_count': sum(len(v) for v in chatbot_brain.templates.values())
        })
    except Exception as e:
        return error_response(f'Stats error: {str(e)}', status_code=500)
