import { Cart } from "../../services/cart";
import { IProduct } from "../../services/product";

const mockProduct: IProduct = {
	id: 1,
	title: "iPhone 9",
	description: "An apple mobile which is nothing like apple",
	price: 550,
	thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
};

const mockDiscount = { code: "10OFF", percent: 10 };

describe("Cart Service", () => {
	let cart: Cart;

	beforeEach(() => {
		cart = new Cart();
	});

	it("should add a product to the cart", () => {
		cart.add(mockProduct, 3);
		expect(cart.items).toEqual([
			{
				...mockProduct,
				qty: 3,
			},
		]);
	});

	it("should update the quantity of a product in the cart", () => {
		cart.add(mockProduct, 3);
		cart.update(mockProduct.id, 5);
		expect(cart.items[0].qty).toBe(5);
	});

	it("should throw an error when updating a non-existent product", () => {
		expect(() => cart.update(2, 5)).toThrowError("Product doesn't exists in cart");
	});

	it("should remove a product from the cart", () => {
		cart.add(mockProduct, 3);
		cart.remove(mockProduct.id);
		expect(cart.items).toEqual([]);
	});

	it("should throw an error when removing a non-existent product", () => {
		expect(() => cart.remove(2)).toThrowError("Product doesn't exists in cart");
	});

	it("should apply a discount to the cart", () => {
		cart.applyDiscount(mockDiscount);
		expect(cart.discount).toEqual(mockDiscount);
	});

	it("should remove the discount from the cart", () => {
		cart.applyDiscount(mockDiscount);
		cart.removeDiscount();
		expect(cart.discount).toBeNull();
	});

	it("should calculate totals accurately", () => {
		cart.add(mockProduct, 3);
		cart.applyDiscount(mockDiscount);
		expect(cart.subTotal).toBe(1650);
		expect(cart.discountAmt).toBe(165);
		expect(cart.total).toBe(1485);
	});
});
