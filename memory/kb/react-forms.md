# React 表单模式库

> 本文件记录 React 表单处理最佳实践 (react-hook-form + zod)

## 索引
- [基础表单](#基础表单)
- [验证模式](#验证模式)
- [错误处理](#错误处理)

---

## 基础表单

### react-hook-form + zod 模板
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
});

type FormData = z.infer<typeof schema>;

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // 提交逻辑
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}

      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}

      <button disabled={isSubmitting}>Submit</button>
    </form>
  );
};
```

---

## 验证模式

### 常用验证规则
```typescript
const schema = z.object({
  // 邮箱
  email: z.string().email('Invalid email format'),

  // 密码 (8位 + 大小写 + 数字)
  password: z.string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'Need uppercase')
    .regex(/[a-z]/, 'Need lowercase')
    .regex(/[0-9]/, 'Need number'),

  // 必填
  name: z.string().min(1, 'Required'),

  // URL
  website: z.string().url('Invalid URL').optional(),

  // 自定义
  custom: z.string().refine(val => val.includes('@'), {
    message: 'Must contain @',
  }),
});
```

---

## 错误处理

### 错误消息显示
```tsx
const ErrorMessage = ({ name }: { name: Path<FormData> }) => {
  const { formState: { errors } } = useFormContext();
  const error = errors[name];

  if (!error) return null;

  return (
    <span className="text-red-500 text-sm">
      {error.message as string}
    </span>
  );
};

// 使用
<ErrorMessage name="email" />
<ErrorMessage name="password" />
```

---

## 更新记录
| 日期 | 变更 |
|-----|------|
| 2026-04-16 | 初始版本 (头脑风暴补充) |
