import products from "../assets/products.json";

export interface IProduct {
	id: number;
	title: string;
	description: string;
	price: number;
	thumbnail: string;
}

export class Products {
	items: IProduct[];

	constructor() {
		this.items = products;
	}

	getProductById(id: number) {
		return this.items.find((product) => product.id === id);
	}
}
