import { ObjectId } from 'mongodb';

export class CartItem {
    _id!: ObjectId;
    productId!: string;
    name!: string;
    quantity!: number;
    price!: number;

    get subtotal(): number {
        return this.price * this.quantity;
    }

    constructor(partial?: Partial<CartItem>) {
        if (partial) {
            const { subtotal, ...rest } = partial as any;
            Object.assign(this, rest);
        }
        this._id = this._id ?? new ObjectId();
    }
}

export class Cart {
    _id!: ObjectId;
    userId: string;
    items: CartItem[];
    createdAt: Date;
    updatedAt: Date;

    constructor(partial?: Partial<Cart>) {
        this._id = partial?._id ?? new ObjectId();
        this.createdAt = partial?.createdAt ?? new Date();
        this.updatedAt = partial?.updatedAt ?? new Date();
        this.userId = partial?.userId ?? '';
        this.items = partial?.items?.map(item => new CartItem(item)) ?? [];
        this.updateTotalAmount();
    }

    private _totalAmount: number = 0;

    get totalAmount(): number {
        return this._totalAmount;
    }

    private updateTotalAmount(): void {
        this._totalAmount = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    }

    addItem(item: CartItem): void {
        this.items.push(item);
        this.updateTotalAmount();
        this.updatedAt = new Date();
    }

    updateItemQuantity(itemId: string, quantity: number): boolean {
        const item = this.items.find(i => i._id.toString() === itemId);
        if (!item) return false;
        item.quantity = quantity;
        this.updateTotalAmount();
        this.updatedAt = new Date();
        return true;
    }

    removeItem(itemId: string): boolean {
        const initialLength = this.items.length;
        this.items = this.items.filter(item => item._id.toString() !== itemId);
        if (this.items.length !== initialLength) {
            this.updateTotalAmount();
            this.updatedAt = new Date();
            return true;
        }
        return false;
    }

    clear(): void {
        this.items = [];
        this._totalAmount = 0;
        this.updatedAt = new Date();
    }

    toJSON(): any {
        return {
            _id: this._id,
            userId: this.userId,
            items: this.items.map(item => ({
                _id: item._id,
                productId: item.productId,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromJSON(json: any): Cart {
        return new Cart({
            _id: json._id ? new ObjectId(json._id) : undefined,
            userId: json.userId,
            items: json.items ? json.items.map((item: any) => new CartItem(item)) : [],
            createdAt: json.createdAt ? new Date(json.createdAt) : undefined,
            updatedAt: json.updatedAt ? new Date(json.updatedAt) : undefined
        });
    }
}
