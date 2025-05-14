import {Router} from "express";
import loginRequired from "../middlewares/loginRequired.js";
import { fetchLogHours } from "../controllers/hoursController.js";

const router = Router();

router.post("/",loginRequired,fetchLogHours);
router.post("/logHours",loginRequired,()=>{});


export default router;

