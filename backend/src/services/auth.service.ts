import prisma from "../config/prisma";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
dotenv.config();

type loginInput = {
    username: string;
    password: string;
}

export const login = async(input: loginInput) =>  {
    const {username, password} = input;

    const user = await prisma.admin.findUnique({
        where: {username: username}
    })
    if(!user){
        throw new Error("Invalid username or password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
        throw new Error("Invalid username or password");
    }
    const accessToken = jwt.sign(
        {username: user.username},
        process.env.JWT_SECRET as string,
        {expiresIn: "15m"}
    )
    const refreshToken = jwt.sign(
        {username: user.username},
        process.env.REFRESH_TOKEN as string,
        {expiresIn: "7d"}
    )

    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7);

    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            adminId: user.id,
            expiresAt: refreshExpiry
        }
    });

    return {
        accessToken,
        refreshToken,
        user: {
            username: user.username,
        }
    }
}