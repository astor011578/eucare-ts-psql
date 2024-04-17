import * as express from "express";
import * as userController from "../controllers/user";
const router = express.Router();
const { signUp, login } = userController;

router.post("/signup", signUp);
router.post("/login", login);

export { router as userRouter };
