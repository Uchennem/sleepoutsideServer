import { Router } from "express";
import productRoutes from "./productRoutes.mts";

const router:Router = Router();

// The home page route
router.get("/", (req, res) => {
  res.json({ title: "Home Page" });
});

// load products routes
router.use("/products", productRoutes);

export default router;
