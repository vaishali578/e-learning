import express from "express";
import cors from "cors";
import loadRoutes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import path from "path"
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

const app = express();

/* ---------- Global Middlewares ---------- */
app.use(
  cors({
   origin: [
     "http://localhost:4173",
    "http://localhost:5173",
    "https://mern-globus-e-learning.vercel.app"
  ],
    credentials: true,               
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

/* ---------- Routes ---------- */
loadRoutes(app);

/* ---------- Error Handler (ALWAYS LAST) ---------- */
app.use(errorHandler);

export default app;
