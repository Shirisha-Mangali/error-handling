import express from "express";
import doctorRoutes from "./routes/doctor.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(express.json());
app.use("/admin", adminRoutes);
app.use("/doctors", doctorRoutes);

export default app;
