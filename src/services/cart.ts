import Decimal from "decimal.js";
import { CustomError } from "../errors/customError";
import { IDiscount } from "./discount";
import { IProduct } from "./product";

export interface CartItems extends IProduct {
	qty: number;
}

export class Cart {
	items: CartItems[];
	subTotal: number;
	discount: IDiscount;
	discountAmt: number;
	total: number;

	constructor() {
		this.items = [];
		this.subTotal = 0;
		this.discount = null;
		this.discountAmt = 0;
		this.total = 0;
	}

	add(product: IProduct, qty: number) {
		const existingProduct = this.items.find((item) => item.id === product.id);
		if (existingProduct) {
			existingProduct.qty += qty;
		} else {
			this.items.push({
				...product,
				qty,
			});
		}
		this.updateCalculation();
		return true;
	}

	update(productId: number, qty: number) {
		const existingProduct = this.items.find((item) => item.id === productId);
		if (!existingProduct) throw new CustomError("Product doesn't exists in cart");
		existingProduct.qty = qty;
		this.updateCalculation();
		return true;
	}

	remove(productId: number) {
		const index = this.items.findIndex((item) => item.id === productId);
		if (index === -1) throw new CustomError("Product doesn't exists in cart");
		this.items.splice(index, 1);
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

	applyDiscount(discount: IDiscount) {
		this.discount = discount;
		this.updateCalculation();
	}

	removeDiscount() {
		this.discount = null;
		this.updateCalculation();
	}

	updateCalculation() {
		// have used decimal.js to for calculation precision and once all the calculation is complete than,
		// store the value in respective variable
		const subTotal = this.items.reduce(
			(amt, product) => amt.plus(new Decimal(product.price).times(new Decimal(product.qty))),
			new Decimal(0),
		);
		const discountPercent = new Decimal(this.discount?.percent || 0);
		const discountAmt = subTotal.times(discountPercent.div(100)).toDecimalPlaces(2);
		const total = subTotal.minus(discountAmt).toDecimalPlaces(2);

		this.subTotal = subTotal.toNumber();
		this.discountAmt = discountAmt.toNumber();
		this.total = total.toNumber();
	}
}
