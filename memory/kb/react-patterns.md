# React 开发模式库

> 本文件记录 React/TypeScript 开发的最佳实践模式

## 组件模板

### 函数组件 + TypeScript
```tsx
import { useState, useCallback } from 'react';

interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

export const MyComponent = ({ title, onSubmit }: Props) => {
  const [value, setValue] = useState('');

  const handleSubmit = useCallback(() => {
    onSubmit({ value });
  }, [value, onSubmit]);

  return (
    <div>
      <h1>{title}</h1>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
};
```

### 状态管理 (Zustand)
```tsx
import { create } from 'zustand';

interface Store {
  count: number;
  increment: () => void;
}

export const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

## API 调用模式

### TanStack Query
```tsx
import { useQuery, useMutation } from '@tanstack/react-query';

const fetchData = async () => {
  const res = await fetch('/api/data');
  return res.json();
};

export const Component = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });

  const mutation = useMutation({
    mutationFn: (newData) => fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify(newData),
    }),
  });

  return <div>{/* render */}</div>;
};
```

## 提交前检查清单

- [ ] 所有组件有 TypeScript 类型
- [ ] 无 `any` 类型
- [ ] 异步操作有 loading 状态
- [ ] 错误有 error 边界
- [ ] 响应式布局正常 (mobile/tablet/desktop)
- [ ] 无 console.log
- [ ] 关键交互有 ARIA 标签

---

## 更新记录
| 日期 | 变更 |
|-----|------|
| 2026-04-16 | 初始版本 |
