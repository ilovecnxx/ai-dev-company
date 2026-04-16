# Python 开发模式库

> 本文件记录 Python 开发的最佳实践模式

## API 设计模式

### FastAPI 路由模板
```python
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["resource"])

class CreateSchema(BaseModel):
    name: str
    email: str

class ResponseSchema(BaseModel):
    id: int
    name: str
    email: str

@router.post("/", response_model=ResponseSchema, status_code=201)
async def create(data: CreateSchema):
    # 实现
    pass

@router.get("/{id}", response_model=ResponseSchema)
async def get(id: int):
    # 实现
    pass
```

### 错误处理模式
```python
try:
    result = await do_something()
except ValueError as e:
    raise HTTPException(status_code=400, detail=str(e))
except PermissionError as e:
    raise HTTPException(status_code=403, detail="Permission denied")
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    raise HTTPException(status_code=500, detail="Internal server error")
```

## 数据库模式

### SQLAlchemy 模型模板
```python
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
```

### 迁移记录模板
```markdown
## [日期] 迁移名称

### 升级
```sql
ALTER TABLE ...;
```

### 回滚
```sql
ALTER TABLE ...;
```
```

## 配置管理
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    debug: bool = False

    class Config:
        env_file = ".env"
```

---

## 更新记录
| 日期 | 变更 |
|-----|------|
| 2026-04-16 | 初始版本 |
