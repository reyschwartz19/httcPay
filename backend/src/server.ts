import express from "express";
import cors from "cors";
const app = express();

import paymentRouter from "./routes/payment.route";

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});