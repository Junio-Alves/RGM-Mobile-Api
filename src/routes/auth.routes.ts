import {Router} from "express";
import { ChangePassword, Login } from "../controllers/loginController.js";
import { changePasswordLimiter } from "../middlewares/changePasswordLimiter.js";

const router = Router();

router.post("/",Login);
router.post("/changePassword",changePasswordLimiter,ChangePassword);

export default router;

