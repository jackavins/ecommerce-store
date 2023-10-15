import { Discounts } from "../../services/discount";
import { Products } from "../../services/product";
import { Store } from "../../services/store";
import { UserStore } from "../../services/userStore";

describe("Store Service", () => {
	let store;

	beforeEach(() => {
		process.env.NTH_ORDER = "5";
		store = new Store();
	});

	it("should initialize with empty users, discounts, products, and statistics", () => {
		expect(store.users).toEqual({});
		expect(store.discounts).toBeInstanceOf(Discounts);
		expect(store.products).toBeInstanceOf(Products);
		expect(store.totalOrderPlaced).toBe(0);
		expect(store.totalPurchasedAmount).toBe(0);
		expect(store.totalDiscountAmount).toBe(0);
	});

	it("should add a user", () => {
		store.addUser("user1");
		expect(store.users["user1"]).toBeInstanceOf(UserStore);
	});

	it("should get a user", () => {
		store.addUser("user1");
		const user = store.getUser("user1");
		expect(user).toBeInstanceOf(UserStore);
	});

	it("should count accessible discount codes for a user", () => {
		const orderLength = 10;
		const appliedDiscountLength = 1;
		const result = store.countOfDiscountCodeAccessibleToUser(orderLength, appliedDiscountLength);
		expect(result).toBe(1);
	});

	it("should not get applicable discounts for a user", () => {
		const user = new UserStore();
		const mockOrder = {
			items: [],
			subTotal: 0,
			discount: null,
			discountAmt: 0,
			total: 0,
		};
		user.orders = [
			{ id: 1, ...mockOrder },
			{ id: 2, ...mockOrder },
		];
		user.appliedDiscounts = [{ code: "DISCOUNT1", percent: 10 }];
		store.discounts.items = [{ code: "DISCOUNT1" }, { code: "DISCOUNT2" }, { code: "DISCOUNT3" }];

		const discounts = store.getApplicableDiscountByUser(user);
		expect(discounts).toEqual([]);
	});

	it("should get applicable discounts for a user", () => {
		const user = new UserStore();
		const mockOrder = {
			items: [],
			subTotal: 0,
			discount: null,
			discountAmt: 0,
			total: 0,
		};
		user.orders = [
			{ id: 1, ...mockOrder },
			{ id: 2, ...mockOrder },
			{ id: 3, ...mockOrder },
			{ id: 4, ...mockOrder },
			{ id: 5, ...mockOrder },
			{ id: 6, ...mockOrder },
			{ id: 7, ...mockOrder },
			{ id: 8, ...mockOrder },
			{ id: 9, ...mockOrder },
			{ id: 10, ...mockOrder },
		];
		user.appliedDiscounts = [{ code: "DISCOUNT1", percent: 10 }];
		store.discounts.items = [{ code: "DISCOUNT1" }, { code: "DISCOUNT2" }, { code: "DISCOUNT3" }];

		const discounts = store.getApplicableDiscountByUser(user);
		expect(discounts).toEqual(["DISCOUNT2"]);
	});

	it("should check if a discount can be applied to a user", () => {
		const user = new UserStore();
		const mockOrder = {
			items: [],
			subTotal: 0,
			discount: null,
			discountAmt: 0,
			total: 0,
		};
		user.orders = [
			{ id: 1, ...mockOrder },
			{ id: 2, ...mockOrder },
			{ id: 3, ...mockOrder },
			{ id: 4, ...mockOrder },
			{ id: 5, ...mockOrder },
			{ id: 6, ...mockOrder },
			{ id: 7, ...mockOrder },
			{ id: 8, ...mockOrder },
			{ id: 9, ...mockOrder },
			{ id: 10, ...mockOrder },
		];
		user.appliedDiscounts = [{ code: "DISCOUNT1", percent: 10 }];
		store.discounts.items = [{ code: "DISCOUNT1" }, { code: "DISCOUNT2" }, { code: "DISCOUNT3" }];

		const isValid = store.canDiscountBeAppliedToUser("DISCOUNT2", user);
		expect(isValid).toBe(true);
	});

	it("should not allow applying an already applied discount", () => {
		const user = new UserStore();
		const mockOrder = {
			items: [],
			subTotal: 0,
			discount: null,
			discountAmt: 0,
			total: 0,
		};
		user.orders = [
			{ id: 1, ...mockOrder },
			{ id: 2, ...mockOrder },
			{ id: 3, ...mockOrder },
			{ id: 4, ...mockOrder },
			{ id: 5, ...mockOrder },
			{ id: 6, ...mockOrder },
		];
		user.appliedDiscounts = [{ code: "DISCOUNT1", percent: 10 }];
		store.discounts.items = [{ code: "DISCOUNT1" }, { code: "DISCOUNT2" }, { code: "DISCOUNT3" }];

		const isValid = store.canDiscountBeAppliedToUser("DISCOUNT1", user);
		expect(isValid).toBe(false);
	});
});
