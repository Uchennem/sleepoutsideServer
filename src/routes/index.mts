import { Router } from "express";
import productRoutes from "./product.routes.mts";
import swaggerRoutes from "./swagger.routes.mts";
import userRoutes from "./user.routes.mts";

const router:Router = Router();

// The home page route
router.get("/", (req, res) => {
  res.json({ title: "API V1" });
});

// load products routes
router.use("/products", productRoutes);

router.use("/users", userRoutes);

router.use(swaggerRoutes)


export default router;
