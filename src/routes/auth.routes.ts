import {Router} from "express";
import loginController  from "../controllers/loginController.js";

const router = Router();

router.post("/",loginController.login);
router.post("/changePassword",()=>{});

export default router;

