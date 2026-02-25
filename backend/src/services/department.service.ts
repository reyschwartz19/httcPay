import prisma from "../config/prisma";

export async function getDepartments() {
    return prisma.department.findMany();
}

export async function getDepartmentById(id: number) {
    return  prisma.department.findUnique({
        where: {id}
    });
   }