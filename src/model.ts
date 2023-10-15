export interface Product {
	id: number;
	title: string;
	description: string;
	price: number;
	thumbnail: string;
}

export interface Cart {
	items: Product[];
	subTotal: number;
	discount: _Discount;
	total: number;
}

export interface _Discount {
	id: number;
	name: string;
	percent: number;
}

export interface Statistics {
	totalItemsPurchased: number;
	totalPurchasedAmount: number;
	discountCodes: _Discount[];
	totalDiscountAmount: 20;
}

export interface Store {
	cart: Cart | {};
	orders: Cart[];
}
