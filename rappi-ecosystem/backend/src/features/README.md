# Features

Place your domain feature modules here.

## Convention

Each feature corresponds to a bounded context (e.g., `orders`, `users`, `products`, `delivery`).

### Suggested Structure per Feature

```
features/
└── orders/
    ├── orders.controller.ts    # Route handler functions
    ├── orders.service.ts       # Business logic
    ├── orders.repository.ts    # Database queries
    └── orders.types.ts         # TypeScript interfaces / types
```

### Example Controller

```typescript
// features/orders/orders.controller.ts
import { Request, Response } from 'express';

export const getOrders = async (_req: Request, res: Response): Promise<void> => {
  res.json({ orders: [] });
};
```
