import { Discounts } from "./discount";
import { Products } from "./product";
import { UserStore } from "./userStore";

export class Store {
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

	// Calculate the count of discount codes accessible to a user based on their order history and applied discounts.
	countOfDiscountCodeAccessibleToUser(orderLength: number, appliedDiscountLength) {
		const nthOrder = parseInt(process.env.NTH_ORDER);
		return Math.floor(orderLength / nthOrder) - appliedDiscountLength;
	}

	// Get the applicable discount codes for a user based on their order history and applied discounts.
	getApplicableDiscountByUser({ orders, appliedDiscounts }: UserStore) {
		const accessibleDiscountCodeCount = this.countOfDiscountCodeAccessibleToUser(
			orders.length,
			appliedDiscounts.length,
		);

		if (accessibleDiscountCodeCount > 0) {
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

	// Check if a discount can be applied to a user based on their order history and applied discounts.
	canDiscountBeAppliedToUser(code: string, { orders, appliedDiscounts }: UserStore) {
		let isValid = true;

		if (!this.countOfDiscountCodeAccessibleToUser(orders.length, appliedDiscounts.length)) isValid = false;

		if (appliedDiscounts.find((discount) => discount.code === code)) isValid = false;

		return isValid;
	}
}

export const store = new Store();

export default store;
