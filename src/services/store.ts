import products from "../assets/products.json";
import { CustomError } from "../errors/customError";
import { Product } from "../model";
import { Discount } from "./discount";

class Cart {
	items: Product[];
	subTotal: number;
	discount: Discount;
	discountAmt: number;
	total: number;

	constructor() {
		this.items = [];
		this.subTotal = 0;
		this.discount = null;
		this.discountAmt = 0;
		this.total = 0;
	}

	add(id: number) {
		const foundProduct = products.find((product) => product.id === id);
		if (!foundProduct) throw new CustomError("Invalid Product id");

		if (this.items.find((product) => product.id === id))
			throw new CustomError("Product already added to Cart", 409);

		this.items.push(foundProduct);
		this.updateCalculation();
		return true;
	}

	get() {
		return {
			items: this.items,
			subTotal: this.subTotal,
			discount: this.discount,
			discountAmt: this.discountAmt,
			total: this.total,
		};
	}

	applyDiscount(discount: Discount) {
		this.discount = discount;
		this.updateCalculation();
	}

	updateCalculation() {
		this.subTotal = this.items.reduce((amt, product) => (amt += product.price), 0);
		this.discountAmt = (this.subTotal * (this.discount?.percent || 0)) / 100;
		this.total = this.subTotal - this.discountAmt;
	}
}

class UserStore {
	cart: Cart;
	orders: {
		id: number;
		items: Product[];
		subTotal: number;
		discount: Discount;
		discountAmt: number;
		total: number;
	}[];
	appliedDiscounts: Discount[];

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
			store.discountCodes.push(this.cart.discount.name);
		}

		// clear out the cart
		this.cart = new Cart();
	}

	getDiscount() {
		const nthOrder = parseInt(process.env.NTH_ORDER);
		const accessibleDiscountCount = Math.floor(this.orders.length / nthOrder) - this.appliedDiscounts.length;

		if (accessibleDiscountCount) {
			const discounts = [];
			for (const discount of store.discounts) {
				if (!this.appliedDiscounts.find((appliedDiscount) => appliedDiscount.name === discount.name))
					discounts.push(discount);

				if (discounts.length === accessibleDiscountCount) break;
			}
		}
		return [];
	}
}

class Store {
	users: Record<string, UserStore>;
	discounts: Discount[];
	totalOrderPlaced: number;
	totalPurchasedAmount: number;
	totalDiscountAmount: number;
	discountCodes: string[];

	constructor() {
		this.users = {};
		this.discounts = [];
		this.totalOrderPlaced = 0;
		this.totalPurchasedAmount = 0;
		this.totalDiscountAmount = 0;
		this.discountCodes = [];
	}

	addUser(uid: string) {
		this.users[uid] = new UserStore();
	}

	getUser(uid: string) {
		return this.users[uid];
	}

	addDiscount(name: string) {
		this.discounts.push(new Discount(name));
	}
}

const store = new Store();

export default store;
