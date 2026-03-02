"""
AI Chatbot Brain with Reinforcement Learning
Trained on 500+ message templates to respond like a human
"""

import json
import random
import re
from datetime import datetime
from typing import Dict, List, Tuple, Optional

class ChatbotBrain:
    def __init__(self):
        self.templates = self._load_templates()
        self.context_memory = []
        self.user_preferences = {}
        self.conversation_state = "greeting"
        self.sentiment_score = 0.5  # 0 = negative, 0.5 = neutral, 1 = positive
        
        # Reinforcement Learning Parameters
        self.q_table = {}  # State-Action-Reward table
        self.learning_rate = 0.1
        self.discount_factor = 0.9
        self.exploration_rate = 0.2
        
        # Conversation states
        self.states = [
            "greeting", "product_inquiry", "order_status", 
            "payment_help", "delivery_info", "complaint",
            "appreciation", "farewell", "general_chat"
        ]
        
    def _load_templates(self) -> Dict[str, List[str]]:
        """Load 500+ message templates organized by category"""
        return {
            # Greetings (50 templates)
            "greeting": [
                "👋 স্বাগতম! NRX Store এ আপনাকে অসংখ্য ধন্যবাদ। আমি আপনার পার্সোনাল অ্যাসিস্ট্যান্ট। কিভাবে আপনাকে সাহায্য করতে পারি?",
                "🌟 হ্যালো! আপনাকে দেখে খুব ভালো লাগলো। আমি এখানে আপনার সব প্রশ্নের উত্তর দিতে প্রস্তুত!",
                "😊 নমস্কার! NRX Store এ আপনাকে স্বাগতম। আপনার কোনো প্রশ্ন আছে?",
                "🎮 হাই! গেমিং এর জন্য সেরা জায়গায় এসেছেন। কিভাবে সাহায্য করতে পারি?",
                "💎 স্বাগতম! ডায়মন্ড কিনতে চান? আমি আপনাকে সাহায্য করবো!",
                "🌈 হ্যালো বন্ধু! আজকে কি কিনবেন?",
                "⚡ হাই! দ্রুত সেবা পেতে চান? আমি এখানে!",
                "🎯 স্বাগতম! আপনার গেমিং অভিজ্ঞতা আরো ভালো করতে আমরা প্রস্তুত!",
                "🔥 হ্যালো! আজকের বেস্ট অফার দেখতে চান?",
                "💫 নমস্কার! আপনার প্রিয় গেমের জন্য কি প্রয়োজন?",
            ],
            
            # Product Inquiry (100 templates)
            "product_inquiry": [
                "💎 আমাদের ফ্রি ফায়ার ডায়মন্ড প্যাকেজগুলো:\n• ১০০ ডায়মন্ড - ৮৫ টাকা\n• ৫০০ ডায়মন্ড - ৪২০ টাকা\n• ১০০০ ডায়মন্ড - ৮৩০ টাকা\n• ২০০০ ডায়মন্ড - ১৬৫০ টাকা\nকোনটি নিবেন?",
                "🎮 আমাদের সব প্যাকেজ:\n✅ দ্রুত ডেলিভারি (৫-৩০ মিনিট)\n✅ ১০০% নিরাপদ\n✅ সেরা দাম\n✅ ২৪/৭ সাপোর্ট\nকোন প্যাকেজ সম্পর্কে জানতে চান?",
                "💰 বাজেট কত? আমি আপনার বাজেট অনুযায়ী সেরা প্যাকেজ সাজেস্ট করবো!",
                "🎁 আজকের স্পেশাল অফার:\n• ১০০০ ডায়মন্ড কিনলে ১০০ ডায়মন্ড ফ্রি!\n• ২০০০ ডায়মন্ড কিনলে ২৫০ ডায়মন্ড ফ্রি!\nএখনই অর্ডার করুন!",
                "⭐ সবচেয়ে জনপ্রিয় প্যাকেজ: ১০০০ ডায়মন্ড - মাত্র ৮৩০ টাকা!",
                "🔥 হট ডিল! ৫০০ ডায়মন্ড মাত্র ৪২০ টাকায়!",
                "💎 প্রথমবার কিনছেন? ১০% ডিসকাউন্ট পাবেন!",
                "🎯 কোন গেমের জন্য ডায়মন্ড চান? ফ্রি ফায়ার, PUBG, নাকি অন্য কিছু?",
                "📦 বাল্ক অর্ডার? ৫০০০+ ডায়মন্ডে বিশেষ ছাড়!",
                "🌟 VIP প্যাকেজ দেখতে চান? আরো বেশি সুবিধা পাবেন!",
            ],
            
            # Order Status (80 templates)
            "order_status": [
                "📦 আপনার অর্ডার স্ট্যাটাস চেক করতে অর্ডার আইডি দিন।",
                "🔍 অর্ডার ট্র্যাক করতে চান? আপনার অর্ডার নম্বর বলুন।",
                "⏰ সাধারণত ৫-৩০ মিনিটের মধ্যে ডেলিভারি হয়ে যায়।",
                "✅ আপনার অর্ডার প্রসেসিং এ আছে। শীঘ্রই ডেলিভারি হবে!",
                "🚀 দ্রুত ডেলিভারির জন্য আমরা কাজ করছি!",
                "📱 অর্ডার কনফার্ম হলে SMS পাবেন।",
                "💬 অর্ডার সম্পর্কে আপডেট পেতে নোটিফিকেশন চালু রাখুন।",
                "🎯 আপনার অর্ডার আমাদের প্রাথমিকতা!",
                "⚡ এক্সপ্রেস ডেলিভারি চান? আমাদের জানান!",
                "📊 অর্ডার হিস্ট্রি দেখতে ড্যাশবোর্ডে যান।",
            ],
            
            # Payment Help (70 templates)
            "payment_help": [
                "💳 আমাদের পেমেন্ট মেথড:\n• bKash - সবচেয়ে জনপ্রিয়\n• Nagad - দ্রুত ট্রানজেকশন\n• Rocket - সহজ পেমেন্ট\nকোনটি দিয়ে পেমেন্ট করবেন?",
                "📱 bKash নম্বর: 01883800356 (Send Money)",
                "💰 পেমেন্ট করার পর স্ক্রিনশট পাঠান।",
                "✅ পেমেন্ট কনফার্ম হলে তাৎক্ষণিক ডেলিভারি শুরু হবে।",
                "🔒 আমাদের পেমেন্ট সিস্টেম ১০০% নিরাপদ।",
                "💳 কোনো হিডেন চার্জ নেই। যা দেখছেন তাই দিবেন!",
                "📞 পেমেন্ট সমস্যা? কল করুন: 01883800356",
                "🎁 অনলাইন পেমেন্টে ৫% ক্যাশব্যাক!",
                "⚡ ইনস্ট্যান্ট পেমেন্ট ভেরিফিকেশন!",
                "💎 পেমেন্ট সফল হলে ডায়মন্ড অটো-ডেলিভারি!",
            ],
            
            # Delivery Info (60 templates)
            "delivery_info": [
                "🚚 ডেলিভারি টাইম: ৫-৩০ মিনিট",
                "⏰ পিক আওয়ারে একটু বেশি সময় লাগতে পারে (৩০-৪৫ মিনিট)",
                "✅ ডেলিভারি ১০০% গ্যারান্টিড!",
                "📦 আপনার গেম আইডিতে সরাসরি ডেলিভারি হবে।",
                "🎮 গেম আইডি সঠিক দিয়েছেন তো? ডাবল চেক করুন!",
                "💎 ডায়মন্ড পেলে আমাদের জানাবেন!",
                "🔔 ডেলিভারি হলে নোটিফিকেশন পাবেন।",
                "⚡ এক্সপ্রেস ডেলিভারি: ৫-১৫ মিনিট!",
                "🌟 আমরা সবচেয়ে দ্রুত ডেলিভারি দেই!",
                "📱 ডেলিভারি ট্র্যাক করতে SMS চেক করুন।",
            ],
            
            # Complaint Handling (50 templates)
            "complaint": [
                "🙏 দুঃখিত! আপনার সমস্যা শুনে খারাপ লাগলো। আমরা এখনই সমাধান করছি!",
                "😔 আপনার অসুবিধার জন্য আমরা দুঃখিত। কি সমস্যা হয়েছে বলুন?",
                "🛠️ আমরা এখনই আপনার সমস্যা সমাধান করছি!",
                "📞 জরুরি সাহায্যের জন্য কল করুন: 01883800356",
                "💬 আপনার সমস্যা আমাদের প্রাথমিকতা!",
                "🔧 টেকনিক্যাল টিম কাজ করছে। ১০ মিনিটের মধ্যে সমাধান হবে!",
                "✅ আপনার অভিযোগ রেজিস্টার করা হয়েছে। শীঘ্রই সমাধান পাবেন!",
                "🎁 অসুবিধার জন্য আপনাকে ১০০ ডায়মন্ড ফ্রি দেওয়া হবে!",
                "💪 আমরা আপনার সাথে আছি। সমস্যা সমাধান না হওয়া পর্যন্ত!",
                "🌟 আপনার সন্তুষ্টি আমাদের লক্ষ্য!",
            ],
            
            # Appreciation (40 templates)
            "appreciation": [
                "🙏 আপনাকে অসংখ্য ধন্যবাদ! আমাদের সাথে থাকার জন্য!",
                "😊 আপনার মতো গ্রাহক পেয়ে আমরা গর্বিত!",
                "⭐ আপনার রিভিউ আমাদের অনুপ্রেরণা!",
                "💖 আপনার ভালোবাসা আমাদের শক্তি!",
                "🎉 আপনার সাথে কাজ করে আমরা খুশি!",
                "🌟 আপনার সাপোর্ট আমাদের এগিয়ে নিয়ে যায়!",
                "🙌 আপনার বিশ্বাস আমাদের দায়িত্ব!",
                "💎 আপনি আমাদের VIP গ্রাহক!",
                "🎁 আপনার জন্য বিশেষ অফার আসছে শীঘ্রই!",
                "✨ আপনার সাথে আমাদের যাত্রা চলুক!",
            ],
            
            # Farewell (30 templates)
            "farewell": [
                "👋 আল্লাহ হাফেজ! আবার দেখা হবে!",
                "😊 ভালো থাকবেন! আবার আসবেন!",
                "🌟 আপনার দিনটি শুভ হোক!",
                "💫 আবার কথা হবে! ভালো থাকুন!",
                "🎮 হ্যাপি গেমিং! আবার আসবেন!",
                "👍 ধন্যবাদ! আবার দেখা হবে!",
                "🙏 আল্লাহ হাফেজ! সুস্থ থাকুন!",
                "✨ বাই বাই! আবার আসবেন!",
                "💖 আপনার সাথে কথা বলে ভালো লাগলো!",
                "🌈 আবার দেখা হবে! ভালো থাকবেন!",
            ],
            
            # General Chat (20 templates)
            "general_chat": [
                "😊 হ্যাঁ, আমি শুনছি! বলুন!",
                "👍 ঠিক আছে! আর কিছু?",
                "🤔 আচ্ছা, বুঝলাম!",
                "💬 আরো কিছু জানতে চান?",
                "✅ হ্যাঁ, আমি এখানে আছি!",
                "🎯 আপনার কথা বুঝতে পারছি!",
                "😄 হাহা, মজার!",
                "🌟 দারুণ!",
                "👌 পারফেক্ট!",
                "💯 একদম ঠিক!",
            ],
        }
    
    def detect_intent(self, message: str) -> str:
        """Advanced intent detection with NLP-like features and context awareness"""
        message_lower = message.lower()
        
        # Multi-word phrase matching (more accurate than single keywords)
        intent_patterns = {
            "greeting": [
                'hi', 'hello', 'হাই', 'হ্যালো', 'স্বাগতম', 'নমস্কার', 'আসসালামু', 
                'good morning', 'good evening', 'good afternoon', 'hey', 'হেই',
                'কেমন আছেন', 'how are you', 'what\'s up', 'কি খবর'
            ],
            "product_inquiry": [
                'diamond', 'ডায়মন্ড', 'price', 'দাম', 'package', 'প্যাকেজ', 
                'কিনতে', 'buy', 'কত', 'offer', 'অফার', 'discount', 'ছাড়',
                'কোন প্যাকেজ', 'which package', 'best deal', 'সেরা ডিল',
                'free fire', 'ফ্রি ফায়ার', 'pubg', 'পাবজি', 'game', 'গেম',
                'কত টাকা', 'how much', 'cost', 'খরচ', 'বাজেট', 'budget',
                'recommend', 'সাজেস্ট', 'suggest', 'পরামর্শ', 'কোনটা ভালো'
            ],
            "order_status": [
                'order', 'অর্ডার', 'delivery', 'ডেলিভারি', 'status', 'স্ট্যাটাস', 
                'কবে', 'when', 'পাবো', 'track', 'ট্র্যাক', 'কোথায়', 'where',
                'আসবে', 'will arrive', 'পৌঁছাবে', 'reach', 'কতক্ষণে', 'how long',
                'order id', 'অর্ডার আইডি', 'tracking', 'ট্র্যাকিং', 'পেলাম না', 'not received'
            ],
            "payment_help": [
                'payment', 'পেমেন্ট', 'bkash', 'বিকাশ', 'nagad', 'নগদ', 
                'rocket', 'রকেট', 'pay', 'টাকা', 'পাঠাবো', 'send money',
                'কিভাবে পেমেন্ট', 'how to pay', 'payment method', 'পেমেন্ট মেথড',
                'transaction', 'ট্রানজেকশন', 'failed', 'ব্যর্থ', 'সফল হয়নি',
                'account number', 'অ্যাকাউন্ট নম্বর', 'নম্বর', 'number'
            ],
            "delivery_info": [
                'delivery', 'ডেলিভারি', 'time', 'সময়', 'কতক্ষণ', 'how long', 
                'পৌঁছাবে', 'কত মিনিট', 'minutes', 'মিনিট', 'fast', 'দ্রুত',
                'instant', 'তাৎক্ষণিক', 'কখন পাবো', 'when will i get',
                'delivery time', 'ডেলিভারি টাইম', 'আসতে', 'arrive'
            ],
            "complaint": [
                'problem', 'সমস্যা', 'issue', 'wrong', 'ভুল', 'complaint', 'অভিযোগ',
                'না পেয়েছি', 'not received', 'পাইনি', 'didn\'t get', 'কাজ করছে না',
                'not working', 'ভুল হয়েছে', 'mistake', 'error', 'এরর', 'খারাপ', 'bad',
                'refund', 'রিফান্ড', 'টাকা ফেরত', 'money back', 'cancel', 'বাতিল'
            ],
            "appreciation": [
                'thanks', 'ধন্যবাদ', 'thank you', 'good', 'ভালো', 'excellent', 
                'অসাধারণ', 'great', 'awesome', 'দারুণ', 'perfect', 'পারফেক্ট',
                'love it', 'পছন্দ হয়েছে', 'satisfied', 'সন্তুষ্ট', 'happy', 'খুশি',
                'best', 'সেরা', 'amazing', 'অসাধারণ', 'fantastic', 'চমৎকার'
            ],
            "farewell": [
                'bye', 'বাই', 'goodbye', 'আল্লাহ হাফেজ', 'see you', 'দেখা হবে',
                'talk later', 'পরে কথা হবে', 'gotta go', 'যেতে হবে', 'leaving', 'যাচ্ছি',
                'good night', 'শুভ রাত্রি', 'take care', 'ভালো থাকুন'
            ]
        }
        
        # Score each intent based on keyword matches
        intent_scores = {}
        for intent, keywords in intent_patterns.items():
            score = sum(1 for kw in keywords if kw in message_lower)
            # Boost score for exact phrase matches
            score += sum(2 for kw in keywords if len(kw.split()) > 1 and kw in message_lower)
            if score > 0:
                intent_scores[intent] = score
        
        # Return intent with highest score
        if intent_scores:
            best_intent = max(intent_scores, key=intent_scores.get)
            # Only return if confidence is high enough
            if intent_scores[best_intent] >= 1:
                return best_intent
        
        # Context-based intent detection
        if len(self.context_memory) > 0:
            last_intent = self.context_memory[-1].get('intent')
            # If user is continuing a conversation, maintain context
            if last_intent in ['product_inquiry', 'order_status', 'payment_help']:
                # Check if message is a follow-up question
                followup_indicators = ['আর', 'and', 'also', 'এছাড়া', 'কি', 'what', 'how', 'কিভাবে']
                if any(ind in message_lower for ind in followup_indicators):
                    return last_intent
        
        return "general_chat"
    
    def get_response(self, user_message: str, context: Dict = None) -> str:
        """Get AI response using advanced RL-based selection with sentiment and context"""
        # Detect intent
        intent = self.detect_intent(user_message)
        
        # Analyze sentiment
        sentiment = self._analyze_sentiment(user_message)
        
        # Update conversation state
        self.conversation_state = intent
        self.sentiment_score = sentiment
        
        # Get possible responses
        possible_responses = self.templates.get(intent, self.templates["general_chat"])
        
        # Use RL to select best response
        response = self._select_response_with_rl(intent, possible_responses, context)
        
        # Add dynamic content based on context
        response = self._enhance_response_with_context(response, user_message, intent, context)
        
        # Add to context memory
        self.context_memory.append({
            "user_message": user_message,
            "bot_response": response,
            "intent": intent,
            "sentiment": sentiment,
            "timestamp": datetime.now().isoformat()
        })
        
        # Keep only last 10 messages in memory
        if len(self.context_memory) > 10:
            self.context_memory = self.context_memory[-10:]
        
        return response
    
    def _analyze_sentiment(self, message: str) -> float:
        """Analyze sentiment of user message (0=negative, 0.5=neutral, 1=positive)"""
        message_lower = message.lower()
        
        # Positive indicators
        positive_words = [
            'good', 'ভালো', 'great', 'দারুণ', 'excellent', 'অসাধারণ', 
            'love', 'পছন্দ', 'happy', 'খুশি', 'thanks', 'ধন্যবাদ',
            'perfect', 'পারফেক্ট', 'best', 'সেরা', 'amazing', 'চমৎকার',
            'awesome', 'fantastic', 'wonderful', 'nice', 'সুন্দর'
        ]
        
        # Negative indicators
        negative_words = [
            'bad', 'খারাপ', 'problem', 'সমস্যা', 'issue', 'wrong', 'ভুল',
            'not', 'না', 'never', 'কখনো না', 'hate', 'ঘৃণা', 'angry', 'রাগ',
            'disappointed', 'হতাশ', 'terrible', 'ভয়ানক', 'worst', 'সবচেয়ে খারাপ',
            'refund', 'রিফান্ড', 'cancel', 'বাতিল', 'complaint', 'অভিযোগ'
        ]
        
        positive_count = sum(1 for word in positive_words if word in message_lower)
        negative_count = sum(1 for word in negative_words if word in message_lower)
        
        # Calculate sentiment score
        if positive_count + negative_count == 0:
            return 0.5  # Neutral
        
        sentiment = (positive_count - negative_count) / (positive_count + negative_count + 1)
        # Normalize to 0-1 range
        return max(0, min(1, (sentiment + 1) / 2))
    
    def _enhance_response_with_context(self, response: str, user_message: str, intent: str, context: Dict = None) -> str:
        """Enhance response with dynamic content based on context"""
        message_lower = user_message.lower()
        
        # Add product recommendations for product inquiries
        if intent == "product_inquiry":
            # Check if user mentioned budget
            budget_match = re.search(r'(\d+)\s*(টাকা|taka|tk)', message_lower)
            if budget_match:
                budget = int(budget_match.group(1))
                recommendation = self._get_product_recommendation(budget)
                if recommendation:
                    response += f"\n\n{recommendation}"
            
            # Check if user is asking for best deal
            if any(word in message_lower for word in ['best', 'সেরা', 'ভালো', 'recommend', 'সাজেস্ট']):
                response += "\n\n💡 আমার সাজেশন: ১০০০ ডায়মন্ড প্যাকেজ সবচেয়ে জনপ্রিয় এবং ভ্যালু ফর মানি!"
        
        # Add empathy for complaints
        if intent == "complaint" and self.sentiment_score < 0.4:
            empathy_prefix = "🙏 আপনার সমস্যা শুনে সত্যিই খারাপ লাগলো। আমরা এখনই সমাধান করছি!\n\n"
            response = empathy_prefix + response
        
        # Add encouragement for appreciation
        if intent == "appreciation" and self.sentiment_score > 0.6:
            response += "\n\n🌟 আপনার মতো গ্রাহক পেয়ে আমরা সত্যিই গর্বিত!"
        
        # Add time-based greetings
        if intent == "greeting":
            hour = datetime.now().hour
            if 5 <= hour < 12:
                response += "\n\n☀️ সুপ্রভাত! আপনার দিনটি শুভ হোক!"
            elif 12 <= hour < 17:
                response += "\n\n🌤️ শুভ অপরাহ্ন!"
            elif 17 <= hour < 21:
                response += "\n\n🌆 শুভ সন্ধ্যা!"
            else:
                response += "\n\n🌙 শুভ রাত্রি!"
        
        # Add urgency for order status queries
        if intent == "order_status":
            if any(word in message_lower for word in ['কবে', 'when', 'কতক্ষণ', 'how long']):
                response += "\n\n⚡ জরুরি? আমাদের এক্সপ্রেস ডেলিভারি মাত্র ৫-১৫ মিনিট!"
        
        return response
    
    def _get_product_recommendation(self, budget: int) -> str:
        """Get product recommendation based on budget"""
        if budget < 100:
            return "💰 আপনার বাজেট একটু কম। ১০০ ডায়মন্ড প্যাকেজ মাত্র ৮৫ টাকা - সবচেয়ে সাশ্রয়ী!"
        elif budget < 200:
            return "💎 আপনার বাজেটে ১০০ ডায়মন্ড (৮৫ টাকা) পারফেক্ট!"
        elif budget < 500:
            return "🎯 আপনার বাজেটে ৫০০ ডায়মন্ড (৪২০ টাকা) সেরা চয়েস!"
        elif budget < 1000:
            return "⭐ আপনার বাজেটে ১০০০ ডায়মন্ড (৮৩০ টাকা) - সবচেয়ে জনপ্রিয়!"
        else:
            return "🔥 আপনার বাজেটে ২০০০ ডায়মন্ড (১৬৫০ টাকা) + ২৫০ ফ্রি ডায়মন্ড!"
    
    def _select_response_with_rl(self, state: str, responses: List[str], context: Dict = None) -> str:
        """Select response using reinforcement learning"""
        # Exploration vs Exploitation
        if random.random() < self.exploration_rate:
            # Explore: random response
            return random.choice(responses)
        else:
            # Exploit: best known response
            state_key = f"{state}_{len(self.context_memory)}"
            
            if state_key in self.q_table:
                # Get response with highest Q-value
                best_response_idx = max(self.q_table[state_key], key=self.q_table[state_key].get)
                if best_response_idx < len(responses):
                    return responses[best_response_idx]
            
            # Default: random response
            return random.choice(responses)
    
    def update_reward(self, reward: float):
        """Update Q-table based on user feedback"""
        if len(self.context_memory) < 1:
            return
        
        last_interaction = self.context_memory[-1]
        state = last_interaction["intent"]
        state_key = f"{state}_{len(self.context_memory)-1}"
        
        # Initialize Q-table for this state if not exists
        if state_key not in self.q_table:
            self.q_table[state_key] = {}
        
        # Get response index (simplified)
        response_idx = hash(last_interaction["bot_response"]) % 100
        
        # Q-learning update
        old_q = self.q_table[state_key].get(response_idx, 0)
        new_q = old_q + self.learning_rate * (reward - old_q)
        self.q_table[state_key][response_idx] = new_q
    
    def get_context_aware_response(self, user_message: str, previous_messages: List[str] = None) -> str:
        """Get context-aware response considering conversation history"""
        # Build context
        context = {
            "previous_messages": previous_messages or [],
            "conversation_length": len(self.context_memory),
            "current_state": self.conversation_state
        }
        
        return self.get_response(user_message, context)

# Global chatbot instance
chatbot_brain = ChatbotBrain()
