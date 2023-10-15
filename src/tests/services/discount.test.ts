import { Discounts } from "../../services/discount";

describe("Discounts Service", () => {
	let discounts: Discounts;

	beforeEach(() => {
		discounts = new Discounts();
	});

	it("should initialize with an empty array", () => {
		expect(discounts.items).toEqual([]);
	});

	it("should add a discount", () => {
		discounts.add("10OFF");
		expect(discounts.items).toEqual([{ code: "10OFF", percent: 10 }]);
	});

	it("should get discount codes", () => {
		discounts.add("10OFF");
		discounts.add("20OFF");
		const codes = discounts.getDiscountCodes();
		expect(codes).toEqual(["10OFF", "20OFF"]);
	});

	it("should get a discount by code", () => {
		discounts.add("10OFF", 10);
		const discount = discounts.getByCode("10OFF");
		expect(discount).toEqual({ code: "10OFF", percent: 10 });
	});

	it("should return undefined for a non-existent discount code", () => {
		const discount = discounts.getByCode("INVALIDCODE");
		expect(discount).toBeUndefined();
	});
});
