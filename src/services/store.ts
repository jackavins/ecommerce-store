import { Discounts } from "./discount";
import { Products } from "./product";
import { UserStore } from "./userStore";

class Store {
	users: Record<string, UserStore>;
	products: Products;
	discounts: Discounts;
	totalOrderPlaced: number;
	totalPurchasedAmount: number;
	totalDiscountAmount: number;

	constructor() {
		this.users = {};
		this.discounts = new Discounts();
		this.products = new Products();
		["10OFF", "20OFF", "30OFF"].forEach((code) => this.discounts.add(code));
		this.totalOrderPlaced = 0;
		this.totalPurchasedAmount = 0;
		this.totalDiscountAmount = 0;
	}

	addUser(uid: string) {
		this.users[uid] = new UserStore();
	}

	getUser(uid: string) {
		return this.users[uid];
	}

	countOfDiscountCodeAccessibleToUser(orderLength: number, appliedDiscountLength) {
		const nthOrder = parseInt(process.env.NTH_ORDER);
		return Math.floor(orderLength / nthOrder) - appliedDiscountLength;
	}

	getApplicableDiscountByUser({ orders, appliedDiscounts }: UserStore) {
		const accessibleDiscountCodeCount = this.countOfDiscountCodeAccessibleToUser(
			orders.length,
			appliedDiscounts.length,
		);

		if (accessibleDiscountCodeCount) {
			const discounts = [];
			for (const discount of this.discounts.items) {
				if (!appliedDiscounts.find((appliedDiscount) => appliedDiscount.code === discount.code))
					discounts.push(discount.code);

				if (discounts.length === accessibleDiscountCodeCount) break;
			}
			return discounts;
		}
		return [];
	}

	canDiscountBeAppliedToUser(code: string, { orders, appliedDiscounts }: UserStore) {
		let isValid = true;

		if (!this.countOfDiscountCodeAccessibleToUser(orders.length, appliedDiscounts.length)) isValid = false;

		if (appliedDiscounts.find((discount) => discount.code === code)) isValid = false;

		return isValid;
	}
}

export const store = new Store();

export default store;
