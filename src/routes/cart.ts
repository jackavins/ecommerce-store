import { Router } from "express";
import { body, validationResult } from "express-validator";
import { CustomError } from "../errors/customError";
import store from "../services/store";

const cartRouter = Router();

// this route return the cart info
cartRouter.get("/", (req, res) => {
	const userStore = store.getUser(req.session.uniqueID);
	return res.json(userStore.cart.get());
});

// this route add product to the cart
cartRouter.post(
	"/product",
	body("productId").notEmpty().withMessage("`productId` key is required"),
	body("qty")
		.notEmpty()
		.withMessage("`qty` key is required")
		.isInt({ min: 1 })
		.withMessage("`qty` must be a greater than 0"),
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() });

		const { productId, qty } = req.body;
		const userStore = store.getUser(req.session.uniqueID);

		try {
			const product = store.products.getProductById(productId);
			if (!product) throw new CustomError("Invalid Product Id");

			userStore.cart.add(product, qty);
			return res.json(userStore.cart.get());
		} catch (error) {
			if (error instanceof CustomError) return res.status(error.statusCode).json({ message: error.message });

			return res.status(500).json({ error: "Internal Server Error" });
		}
	},
);

// this route updates the product qty in cart
cartRouter.put(
	"/product/:productId",
	body("qty")
		.notEmpty()
		.withMessage("`qty` key is required")
		.isInt({ min: 1 })
		.withMessage("`qty` must be a greater than 0"),
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() });

		const productId = parseInt(req.params.productId);
		const { qty } = req.body;
		const userStore = store.getUser(req.session.uniqueID);

		try {
			userStore.cart.update(productId, qty);
			return res.json(userStore.cart.get());
		} catch (error) {
			if (error instanceof CustomError) return res.status(error.statusCode).json({ message: error.message });

			return res.status(500).json({ error: "Internal Server Error" });
		}
	},
);

// this route removes the product from cart
cartRouter.delete("/product/:productId", (req, res) => {
	const productId = parseInt(req.params.productId);
	const userStore = store.getUser(req.session.uniqueID);

	try {
		userStore.cart.remove(productId);
		return res.json(userStore.cart.get());
	} catch (error) {
		if (error instanceof CustomError) return res.status(error.statusCode).json({ message: error.message });

		return res.status(500).json({ error: "Internal Server Error" });
	}
});

// this route apply the discount to the cart
cartRouter.post("/discount", body("code").notEmpty().withMessage("`code` key is required"), (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() });

	const userStore = store.getUser(req.session.uniqueID);
	const { code } = req.body;
	try {
		if (!store.discounts.isCodeValid(code)) throw new CustomError("Discount Code is invalid");
		if (!userStore.cart.items.length) throw new CustomError("Discount Code cannot be applied to empty card");
		if (!store.canDiscountBeAppliedToUser(code, userStore))
			throw new CustomError("Discount Code cannot be applied");

		userStore.cart.applyDiscount(store.discounts.getByCode(code));
		return res.json(userStore.cart.get());
	} catch (error) {
		if (error instanceof CustomError) return res.status(error.statusCode).json({ message: error.message });

		return res.status(500).json({ error: "Internal Server Error" });
	}
});

// this route remove the discount from the cart
cartRouter.delete("/discount", (req, res) => {
	const userStore = store.getUser(req.session.uniqueID);
	try {
		userStore.cart.removeDiscount();
		return res.json(userStore.cart.get());
	} catch (error) {
		if (error instanceof CustomError) return res.status(error.statusCode).json({ message: error.message });

		return res.status(500).json({ error: "Internal Server Error" });
	}
});

export default cartRouter;
