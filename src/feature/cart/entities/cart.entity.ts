import { ObjectId } from 'mongodb';

export class CartItem {
    id!: ObjectId;
    productId!: string;
    name!: string;
    quantity!: number;
    price!: number;

    get subtotal(): number {
        return this.price * this.quantity;
    }

    constructor(partial?: Partial<CartItem>) {
        Object.assign(this, partial);
    }
}

export class Cart {
    id: ObjectId;
    userId: string;
    items: CartItem[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial?: Partial<Cart>) {
        this.id = partial?.id ?? new ObjectId();
        this.createdAt = partial?.createdAt ?? new Date();
        this.updatedAt = partial?.updatedAt ?? new Date();
        this.userId = partial?.userId ?? '';
        this.items = partial?.items ?? [];
        this.totalAmount = partial?.totalAmount ?? 0;
    }
}
