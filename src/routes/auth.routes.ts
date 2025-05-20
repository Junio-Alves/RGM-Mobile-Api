import {Router} from "express";
import { ChangePassword, Login } from "../controllers/loginController.js";

const router = Router();

router.post("/",Login);
router.post("/changePassword",ChangePassword);

export default router;

