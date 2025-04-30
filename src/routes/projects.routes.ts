import {Router} from "express";
import { fetchProjects } from "../controllers/tarefasController.js";

const router = Router();

router.get("/",fetchProjects);


export default router;

