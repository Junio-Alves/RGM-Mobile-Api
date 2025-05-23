import { Router } from "express";
import loginRequired from "../middlewares/loginRequired.js";
import { fetchLogHours, logHours } from "../controllers/hoursController.js";
const router = Router();
router.post("/", loginRequired, fetchLogHours);
router.post("/log", loginRequired, logHours);
export default router;
