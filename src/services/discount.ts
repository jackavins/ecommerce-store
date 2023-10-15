export interface IDiscount {
	code: string;
	percent: number;
}

export class Discounts {
	items: IDiscount[];

	constructor() {
		this.items = [];
	}

	getDiscountCodes() {
		return this.items.map((discount) => discount.code);
	}

	getByCode(code: string) {
		return this.items.find((discount) => discount.code === code);
	}

	add(code, percent = 10) {
		this.items.push({
			code,
			percent,
		});
	}

	isCodeValid(code: string) {
		return !!this.getByCode(code);
	}
}
