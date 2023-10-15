import { Router } from "express";
import { body, validationResult } from "express-validator";
import products from "../assets/products.json";
import { CustomError } from "../errors/customError";
import store from "../services/store";
import adminRouter from "./admin";

const router = Router();

router.use((req, res, next) => {
	console.log(store.getUser(req.session.uniqueID));
	next();
});

router.use("/admin", adminRouter);

router.get("/products", (req, res) => res.json(products));

router.get("/cart", (req, res) => {
	const userStore = store.getUser(req.session.uniqueID);
	return res.json(userStore.cart.get());
});

router.post("/cart", body("productId").notEmpty().withMessage("`productId` key is required"), (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() });

	const { productId } = req.body;
	const userStore = store.getUser(req.session.uniqueID);

	try {
		userStore.cart.add(productId);
		return res.json(userStore.cart.get());
	} catch (error) {
		if (error instanceof CustomError) return res.status(error.statusCode).json({ message: error.message });

		return res.status(500).json({ error: "Internal Server Error" });
	}
});

router.post("/checkout", (req, res) => {
	const userStore = store.getUser(req.session.uniqueID);

	if (!userStore.cart.items.length) return res.status(400).json({ message: "No Product added to cart" });

	try {
		userStore.checkout();
		return res.json({ message: "Checkout successful" });
	} catch (error) {
		if (error instanceof CustomError) return res.status(error.statusCode).json({ message: error.message });
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

export default router;
