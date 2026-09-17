import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./Database/database.js";
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
import cloudinaryConnect from "./Database/cloudinary.js";

const app = express();
app.use(bodyParser.json({ limit: '100mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
connectDB();
cloudinaryConnect();
app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowing these methods
  allowedHeaders: ['Content-Type'], // Allow these headers
}));

app.get('/', (req, res) => {
  res.send('Hello World')
})

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