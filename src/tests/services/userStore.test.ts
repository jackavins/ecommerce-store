import { IProduct } from "../../services/product";
import { UserStore } from "../../services/userStore";

const mockProduct: IProduct = {
	id: 1,
	title: "iPhone 9",
	description: "An apple mobile which is nothing like apple",
	price: 550,
	thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
};

const mockDiscount = { code: "10OFF", percent: 10 };

describe("UserStore Service", () => {
	let userStore;

	beforeEach(() => {
		userStore = new UserStore();
	});

	it("should initialize with an empty cart, orders, and applied discounts", () => {
		expect(userStore.cart.items).toEqual([]);
		expect(userStore.orders).toEqual([]);
		expect(userStore.appliedDiscounts).toEqual([]);
	});

	it("should checkout and add an order", () => {
		userStore.cart.add(mockProduct, 3);
		userStore.checkout();
		expect(userStore.orders.length).toBe(1);
	});

	it("should apply a discount during checkout", () => {
		userStore.cart.applyDiscount(mockDiscount);
		userStore.checkout();
		expect(userStore.appliedDiscounts).toContain(mockDiscount);
	});

	it("should clear the cart after checkout", () => {
		userStore.cart.add(mockProduct, 3);
		userStore.checkout();
		expect(userStore.cart.items).toEqual([]);
	});
});
