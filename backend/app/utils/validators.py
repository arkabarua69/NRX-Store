from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime

class RegisterSchema(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: Optional[str] = None

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class CreateGameSchema(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    slug: str = Field(min_length=1, max_length=100)
    description: Optional[str] = None
    image_url: Optional[str] = None
    category: str
    is_active: bool = True

class CreateProductSchema(BaseModel):
    game_id: str
    name: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    price: float = Field(gt=0)
    original_price: Optional[float] = None
    currency: str = Field(default='USD')
    stock: int = Field(ge=0)
    is_featured: bool = False
    is_active: bool = True
    diamonds: Optional[int] = Field(default=0, ge=0)
    image_url: Optional[str] = None
    category: Optional[str] = Field(default='standard')
    
    @validator('original_price')
    def validate_original_price(cls, v, values):
        if v is not None and 'price' in values and v < values['price']:
            raise ValueError('Original price must be greater than or equal to price')
        return v

class CreateOrderSchema(BaseModel):
    product_id: str
    quantity: int = Field(gt=0, le=100)
    player_id: str = Field(min_length=1)
    player_name: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    notes: Optional[str] = None

class UpdateOrderStatusSchema(BaseModel):
    status: str = Field(pattern='^(pending|processing|completed|cancelled|refunded)$')
    admin_notes: Optional[str] = None

class PaymentProofSchema(BaseModel):
    order_id: str
    payment_method: str
    transaction_id: Optional[str] = None
    proof_url: str

def validate_request(schema_class):
    """Decorator to validate request data against Pydantic schema"""
    def decorator(f):
        from functools import wraps
        from flask import request, jsonify
        
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                data = request.get_json()
                validated_data = schema_class(**data)
                request.validated_data = validated_data
                return f(*args, **kwargs)
            except Exception as e:
                return jsonify({'error': 'Validation error', 'details': str(e)}), 400
        
        return decorated_function
    return decorator
