import { Products } from "../../services/product";

const mockProducts = [
	{
		id: 1,
		title: "iPhone 9",
		description: "An apple mobile which is nothing like apple",
		price: 550,
		thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
	},
];
const products = new Products();
products.items = mockProducts;

describe("Products Service", () => {
	it("should get a product by ID", () => {
		const product = products.getProductById(1);
		expect(product).toEqual(mockProducts[0]);
	});

	it("should return undefined for a non-existent product ID", () => {
		const product = products.getProductById(999);
		expect(product).toBeUndefined();
	});
});
