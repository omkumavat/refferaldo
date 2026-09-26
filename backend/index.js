import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./Database/database.js";
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
import cloudinaryConnect from "./Database/cloudinary.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(bodyParser.json({ limit: '100mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
connectDB();
cloudinaryConnect();
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

import authRoutes from "./Routes/authRoutes.js";
app.use("/api/auth", authRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '..', 'src', 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.get("/s", (req, res) => {
  const otp="123456"
  res.render("Verification", { verificationUrl: "OKM"});
});


app.listen(4000, () => {
  console.log("app is listening on port 4000");
});
// export default app;