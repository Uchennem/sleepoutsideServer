import {Router } from "express";
import swaggerUI from "swagger-ui-express";
import swaggerDocument from "../swaggerDesign.json" with {type: "json"}

const router:Router = Router();
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

export default router;