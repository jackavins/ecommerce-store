import { Cart, CartItems } from "./cart";
import { IDiscount } from "./discount";
import { store } from "./store";

export class UserStore {
	cart: Cart;
	orders: {
		id: number;
		items: CartItems[];
		subTotal: number;
		discount: IDiscount;
		discountAmt: number;
		total: number;
	}[];
	appliedDiscounts: IDiscount[];

	constructor() {
		this.cart = new Cart();
		this.orders = [];
		this.appliedDiscounts = [];
	}

	checkout() {
		// add card detail to order
		this.orders.push({
			id: this.orders.length + 1,
			...this.cart.get(),
		});

		if (this.cart.discount) this.appliedDiscounts.push(this.cart.discount);

		// update store statistic info
		store.totalOrderPlaced++;
		store.totalPurchasedAmount += this.cart.total;
		if (this.cart.discount) {
			store.totalDiscountAmount += this.cart.discountAmt;
		}

		// clear out the cart
		this.cart = new Cart();
	}
}
