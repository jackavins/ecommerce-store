import { Router } from "express";
import { body, validationResult } from "express-validator";
import { CustomError } from "../errors/customError";
import store from "../services/store";

const adminRouter = Router();

adminRouter.get("/statistics", (req, res) => {
	const userStore = store.getUser(req.session.uniqueID);
	res.json({
		totalItemsPurchased: store.totalOrderPlaced,
		totalPurchasedAmount: store.totalPurchasedAmount,
		discountCodes: store.discounts.getDiscountCodes(),
		totalDiscountAmount: store.totalDiscountAmount,
	});
});

adminRouter.post("/discount", body("code").notEmpty().withMessage("`code` key is required"), (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ message: "Validation failed", errors: errors.array() });

	const { code } = req.body;
	try {
		store.discounts.add(code);
		return res.json({ message: "Discount added Successfully" });
	} catch (error) {
		if (error instanceof CustomError) return res.status(error.statusCode).json({ message: error.message });
		return res.status(500).json({ error: "Internal Server Error" });
	}
});

export default adminRouter;
