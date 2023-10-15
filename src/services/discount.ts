export class Discount {
	name: string;
	percent: number;

	constructor(name, percent = 10) {
		this.name = name;
		this.percent = percent;
	}
}
