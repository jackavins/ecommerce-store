import { Router } from "express";
import store from "../services/store";

const adminRouter = Router();

adminRouter.get("/statistics", (req, res) => {
	const userStore = store.getUser(req.session.uniqueID);
	res.json({
		totalItemsPurchased: store.totalOrderPlaced,
		totalPurchasedAmount: store.totalPurchasedAmount,
		discountCodes: store.discountCodes,
		totalDiscountAmount: store.totalDiscountAmount,
	});
});

export default adminRouter;
