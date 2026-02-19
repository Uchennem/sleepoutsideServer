import type { Request, Response } from "express";
import { Router } from "express";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import { sanitize } from "../services/utils.mts";
import userService from "../services/user.service.mts";
import authorize from "../middleware/authorize.mts";

const router: Router = Router();

router.post("/login", async (req, res, next) => {
  try {
    const cleanBody = sanitize({ ...req.body } as Record<string, any>);
    const email = typeof cleanBody.email === "string" ? cleanBody.email.trim().toLowerCase() : "";
    const password = typeof cleanBody.password === "string" ? cleanBody.password.trim() : "";

    if (!email || !password) {
      return next(
        new EntityNotFoundError({
          message: "Email and password are required.",
          statusCode: 400,
          code: "ERR_VALID",
        })
      );
    }

    const { user, token } = await userService.login(email, password);

    if (!user || !token || !user._id) {
      return next(
        new EntityNotFoundError({
          message: "Invalid email or password.",
          statusCode: 401,
          code: "ERR_VALID",
        })
      );
    }

    res.status(200).json({
      token,
      user: {
        _id: String(user._id),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const cleanBody = sanitize({ ...req.body } as Record<string, any>);
    const email = typeof cleanBody.email === "string" ? cleanBody.email.trim().toLowerCase() : "";
    const password = typeof cleanBody.password === "string" ? cleanBody.password.trim() : "";
    const name = typeof cleanBody.name === "string" ? cleanBody.name.trim() : "";

    if (!email || !password || !name) {
      return next(
        new EntityNotFoundError({
          message: "Name, email, and password are required.",
          statusCode: 400,
          code: "ERR_VALID",
        })
      );
    }

    const user = await userService.register(email, password, name);

    res.status(201).json({
      message: "User created successfully.",
      user: {
        _id: String(user._id),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/protected", authorize, (req: Request, res: Response) => {
  res.json({ message: `Hello, ${res.locals.user.email}!` });
});

export default router;
