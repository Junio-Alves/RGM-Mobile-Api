import express from "express";
import projectRoutes from "./routes/projects.routes.js";
import authRoutes from "./routes/auth.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import hoursRoutes from "./routes/apointment.routes.js";


class App{
    app: express.Application;

    constructor(){
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use(express.json());
    }

    routes(){
      this.app.use("/projects",projectRoutes);
      this.app.use("/login",authRoutes);
      this.app.use("/tasks",tasksRoutes);
      this.app.use("/hours",hoursRoutes);
    }
}

export default new App().app;
