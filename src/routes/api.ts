import { Router } from "express";
import { CustomError } from "../errors/customError";
import store from "../services/store";
import adminRouter from "./admin";
import cartRouter from "./cart";

const router = Router();

router.use("/admin", adminRouter);
router.use("/cart", cartRouter);

router.get("/products", (req, res) => res.json(store.products));

// this route return the discount that can be applied for particular user
router.get("/discount", (req, res) => {
	const userStore = store.getUser(req.session.uniqueID);
	return res.json(store.getApplicableDiscountByUser(userStore));
});

// this route checkout the products added to the cart
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
