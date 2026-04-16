# 认证模式库

> 本文件记录认证/JWT 最佳实践模式

## 索引
- [JWT 认证](#jwt-认证)
- [Password Hashing](#password-hashing)
- [Session 管理](#session-管理)

---

## JWT 认证

### FastAPI JWT 模板
```python
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import jwt

router = APIRouter()
security = HTTPBearer()

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    user = await authenticate_user(data.email, data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id})
    return TokenResponse(access_token=token)

def create_access_token(data: dict) -> str:
    payload = {**data, "exp": datetime.utcnow() + timedelta(hours=24)}
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
```

### JWT 验证依赖
```python
async def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    try:
        payload = jwt.decode(
            credentials.credentials,
            SECRET_KEY,
            algorithms=["HS256"]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

---

## Password Hashing

### 使用 bcrypt
```python
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())
```

---

## Session 管理

### Redis Session
```python
import redis

redis_client = redis.from_url("redis://localhost")

def create_session(user_id: str) -> str:
    session_id = secrets.token_urlsafe(32)
    redis_client.setex(f"session:{session_id}", 86400, user_id)
    return session_id

def get_session(session_id: str) -> Optional[str]:
    return redis_client.get(f"session:{session_id}")

def delete_session(session_id: str):
    redis_client.delete(f"session:{session_id}")
```

---

## 更新记录
| 日期 | 变更 |
|-----|------|
| 2026-04-16 | 初始版本 (头脑风暴补充) |
