import express from "express";
import { Request, Response } from "express";
import cors from "cors";
const app = express();
import pool from './config/db';

const port = 3001;

app.use(cors(
    {

    }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});