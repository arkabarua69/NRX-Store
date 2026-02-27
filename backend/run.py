from app import create_app
from app.config import config
import os

# Create app instance for Gunicorn
env = os.getenv('FLASK_ENV', 'production')
app = create_app(config[env])

if __name__ == '__main__':
    # For local development only
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])
