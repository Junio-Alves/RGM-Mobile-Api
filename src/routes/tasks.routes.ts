import {Router} from "express";
import loginRequired from "../middlewares/loginRequired.js";
import { fetchTasks } from "../controllers/tasksController.js";

const router = Router();

router.post("/",loginRequired,fetchTasks);


export default router;

