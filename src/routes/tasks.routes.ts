import {Router} from "express";
import { fetchProjects } from "../controllers/projectsController.js";
import loginRequired from "../middlewares/loginRequired.js";

const router = Router();

router.get("/",loginRequired,fetchProjects);


export default router;

