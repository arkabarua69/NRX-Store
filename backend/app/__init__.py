from flask import Flask
from flask_cors import CORS
from app.config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS with all necessary headers
    CORS(app, resources={
        r"/*": {
            "origins": app.config['CORS_ORIGINS'],
            "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            "allow_headers": [
                "Content-Type", 
                "Authorization", 
                "Cache-Control", 
                "Pragma", 
                "Expires",
                "X-Requested-With"
            ],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True,
            "max_age": 3600
        }
    })
    
    # Register blueprints
    from app.controllers.auth_controller import auth_bp
    from app.controllers.game_controller import game_bp
    from app.controllers.product_controller import product_bp
    from app.controllers.order_controller import order_bp
    from app.controllers.order_v2_controller import order_v2_bp
    from app.controllers.simple_order_controller import simple_order_bp
    from app.controllers.admin_controller import admin_bp
    from app.controllers.user_controller import user_bp
    from app.controllers.review_controller import review_bp
    from app.controllers.settings_controller import settings_bp
    from app.controllers.notification_controller import notification_bp
    from app.controllers.admin_notification_controller import admin_notification_bp
    from app.controllers.faq_controller import faq_bp
    from app.controllers.support_controller import support_bp
    from app.controllers.upload_controller import upload_bp
    from app.controllers.chatbot_controller import chatbot_bp
    from app.controllers.stats_controller import stats_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(game_bp, url_prefix='/api/games')
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(order_bp, url_prefix='/api/orders')
    app.register_blueprint(order_v2_bp, url_prefix='/api/orders-v2')
    app.register_blueprint(simple_order_bp, url_prefix='/api/simple-orders')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(review_bp, url_prefix='/api/reviews')
    app.register_blueprint(settings_bp, url_prefix='/api/settings')
    app.register_blueprint(notification_bp, url_prefix='/api/notifications')
    app.register_blueprint(admin_notification_bp, url_prefix='/api')
    app.register_blueprint(faq_bp, url_prefix='/api/faq')
    app.register_blueprint(support_bp, url_prefix='/api/support')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')
    app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
    app.register_blueprint(stats_bp, url_prefix='/api/stats')
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'service': 'game-topup-api'}, 200
    
    return app
