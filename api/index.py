# Vercel Serverless Function for Backend API
# This file allows deploying Flask backend on Vercel

import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import app

# Vercel serverless function handler
def handler(request, context):
    return app(request, context)
