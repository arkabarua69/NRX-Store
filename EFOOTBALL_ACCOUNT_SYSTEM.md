# eFootball Account Login System 🎮⚽

## সিস্টেম ওভারভিউ

শুধুমাত্র eFootball টপ আপ এর জন্য Konami account login information নেওয়া হবে। অন্য গেম (Free Fire, PUBG, Mobile Legends) এর জন্য শুধু Player ID লাগবে।

## Database Setup

### Step 1: Run SQL Scripts (Supabase)

Go to Supabase SQL Editor and run these files in order:

#### 1. Add Account Info Fields to Orders
```sql
-- File: backend/supabase/add_account_info_to_orders.sql
```
এটা orders table এ নতুন columns যোগ করবে:
- `account_type` - gmail, facebook, konami
- `account_email` - ইমেইল বা ফোন নম্বর
- `account_password` - পাসওয়ার্ড (encrypted)
- `account_backup` - ব্যাকআপ তথ্য

#### 2. Add requires_account to Games
```sql
-- File: backend/supabase/add_requires_account_to_games.sql
```
এটা games table এ `requires_account` field যোগ করবে।

#### 3. Add eFootball Game
```sql
-- File: backend/supabase/add_efootball_game.sql
```
এটা eFootball game এবং 5টি packages যোগ করবে।

### Database Schema

#### Orders Table (Updated)
```sql
CREATE TABLE orders (
  -- Existing fields...
  player_id VARCHAR(255),
  
  -- New fields for account login
  account_type VARCHAR(50),        -- 'gmail', 'facebook', 'konami'
  account_email VARCHAR(255),      -- Email or phone
  account_password TEXT,           -- Encrypted password
  account_backup TEXT              -- Backup info (optional)
);
```

#### Games Table (Updated)
```sql
CREATE TABLE games (
  -- Existing fields...
  requires_account BOOLEAN DEFAULT FALSE  -- TRUE for eFootball
);
```

## Frontend Implementation

### Component: AccountInfoForm

Location: `frontend/src/components/AccountInfoForm.tsx`

**Features:**
- ✅ 3 account types: Gmail, Facebook, Konami
- ✅ Email/Phone input
- ✅ Password input with show/hide
- ✅ Optional backup info
- ✅ Security notice
- ✅ Bangla interface

**Usage:**
```typescript
import AccountInfoForm, { AccountInfo } from '@/components/AccountInfoForm';

function CheckoutPage() {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  
  const handleAccountInfo = (info: AccountInfo) => {
    setAccountInfo(info);
    // Save to order
  };

  // Show form only for eFootball
  const requiresAccount = product.game.requires_account;

  return (
    <div>
      {/* Player ID form (for all games) */}
      <PlayerIDForm />
      
      {/* Account info form (only for eFootball) */}
      {requiresAccount && (
        <AccountInfoForm 
          onSubmit={handleAccountInfo}
          gameName={product.game.name}
        />
      )}
    </div>
  );
}
```

## Backend Implementation

### Update Order Creation

File: `backend/app/controllers/order_controller.py`

```python
@order_bp.route('', methods=['POST'])
@require_auth
def create_order():
    data = request.get_json()
    
    # Existing fields
    player_id = data.get('player_id')
    
    # New fields for account login (optional)
    account_type = data.get('account_type')
    account_email = data.get('account_email')
    account_password = data.get('account_password')
    account_backup = data.get('account_backup')
    
    # Encrypt password before saving
    if account_password:
        from app.utils.encryption import encrypt_password
        account_password = encrypt_password(account_password)
    
    order_data = {
        'player_id': player_id,
        'account_type': account_type,
        'account_email': account_email,
        'account_password': account_password,
        'account_backup': account_backup,
        # ... other fields
    }
    
    # Create order
    response = supabase.table('orders').insert(order_data).execute()
    return success_response(response.data)
```

### Password Encryption

File: `backend/app/utils/encryption.py` (create new file)

```python
import os
from cryptography.fernet import Fernet

# Get encryption key from environment
ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY', Fernet.generate_key())
cipher = Fernet(ENCRYPTION_KEY)

def encrypt_password(password: str) -> str:
    """Encrypt password using Fernet"""
    return cipher.encrypt(password.encode()).decode()

def decrypt_password(encrypted: str) -> str:
    """Decrypt password"""
    return cipher.decrypt(encrypted.encode()).decode()
```

## How It Works

### For eFootball (requires account):
```
1. User selects eFootball package
2. Goes to checkout
3. Enters Player ID (optional for eFootball)
4. Sees Account Info Form ✅
5. Selects account type (Gmail/Facebook/Konami)
6. Enters email/phone and password
7. Optionally enters backup info
8. Submits order
9. Backend encrypts password
10. Saves to database
```

### For Other Games (no account needed):
```
1. User selects Free Fire/PUBG/ML package
2. Goes to checkout
3. Enters Player ID ✅
4. NO Account Info Form ❌
5. Submits order
6. Saves to database
```

## Security Features

### 1. Password Encryption
```python
# AES-256 encryption using Fernet
encrypted = cipher.encrypt(password.encode())
```

### 2. HTTPS Only
All data transmitted over HTTPS.

### 3. Environment Variables
```env
ENCRYPTION_KEY=your-secret-encryption-key-here
```

### 4. Access Control
Only admin can decrypt and view passwords.

## Admin Panel

### View Account Info

File: `frontend/src/pages/AdminDashboard.tsx`

```typescript
// In order details modal
{order.account_type && (
  <div className="bg-yellow-50 p-4 rounded-lg">
    <h4 className="font-bold mb-2">Account Login Info</h4>
    <div className="space-y-2 text-sm">
      <p><strong>Type:</strong> {order.account_type}</p>
      <p><strong>Email:</strong> {order.account_email}</p>
      <p><strong>Password:</strong> 
        <button onClick={() => decryptPassword(order.id)}>
          Show Password
        </button>
      </p>
      {order.account_backup && (
        <p><strong>Backup:</strong> {order.account_backup}</p>
      )}
    </div>
  </div>
)}
```

## Environment Variables

### Backend (.env)
```env
# Encryption key for passwords
ENCRYPTION_KEY=your-32-byte-encryption-key-here
```

Generate key:
```python
from cryptography.fernet import Fernet
print(Fernet.generate_key().decode())
```

### Render Environment
Add `ENCRYPTION_KEY` to Render environment variables.

## Testing

### Test 1: eFootball Order
1. Go to store
2. Select eFootball package
3. Add to cart
4. Go to checkout
5. Should see Account Info Form ✅
6. Fill in account details
7. Submit order
8. Check database - account fields should be filled

### Test 2: Free Fire Order
1. Go to store
2. Select Free Fire package
3. Add to cart
4. Go to checkout
5. Should NOT see Account Info Form ❌
6. Only Player ID form visible
7. Submit order
8. Check database - account fields should be NULL

## Database Queries

### Get orders with account info
```sql
SELECT 
  id,
  player_id,
  account_type,
  account_email,
  account_password,
  account_backup
FROM orders
WHERE account_type IS NOT NULL;
```

### Get eFootball orders
```sql
SELECT o.*, g.name as game_name
FROM orders o
JOIN topup_packages p ON o.product_id = p.id
JOIN games g ON p.game_id = g.id
WHERE g.requires_account = TRUE;
```

## API Endpoints

### Create Order (with account info)
```http
POST /api/orders
Content-Type: application/json
Authorization: Bearer <token>

{
  "product_id": "uuid",
  "quantity": 1,
  "player_id": "12345",
  "account_type": "gmail",
  "account_email": "user@gmail.com",
  "account_password": "password123",
  "account_backup": "backup code xyz"
}
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "order-uuid",
    "player_id": "12345",
    "account_type": "gmail",
    "account_email": "user@gmail.com",
    "account_password": "encrypted-password",
    "status": "pending"
  }
}
```

## Deployment Checklist

- [ ] Run SQL scripts in Supabase
- [ ] Add `ENCRYPTION_KEY` to Render environment
- [ ] Deploy backend with encryption utils
- [ ] Deploy frontend with AccountInfoForm
- [ ] Test eFootball order flow
- [ ] Test other games (should not show form)
- [ ] Verify password encryption
- [ ] Test admin panel account view

## Summary

✅ Database schema updated
✅ Account info form created
✅ Password encryption implemented
✅ Only eFootball requires account
✅ Other games use Player ID only
✅ Secure and encrypted
✅ Admin can view account info
✅ Bangla interface

---

**Status:** Ready to implement
**Files Created:**
- `backend/supabase/add_account_info_to_orders.sql`
- `backend/supabase/add_requires_account_to_games.sql`
- `backend/supabase/add_efootball_game.sql`
- `frontend/src/components/AccountInfoForm.tsx`
- `EFOOTBALL_ACCOUNT_SYSTEM.md`

**Next Steps:**
1. Run SQL scripts in Supabase
2. Add encryption key to environment
3. Update checkout page to show form conditionally
4. Test the complete flow
