import express from "express";
import cors from "cors";
const app = express();

import paymentRouter from "./routes/payment.route";
import authRouter from "./routes/auth.route";
import ReferenceRouter from "./routes/references.route";

const port = 3001;

app.use(cors(
    {
        origin: "http://localhost:3001",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/payments", paymentRouter);
app.use("/api/auth", authRouter);
app.use("/api/references", ReferenceRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});