import prisma from "../config/prisma";

export interface ReferenceDTO {
    id: number;
    name: string;
}



export const getDepartments = async (): Promise<ReferenceDTO[]> => {
     const departments = await prisma.department.findMany({
        select: {
            id: true,
            name: true
        },
        orderBy: {
            name: "asc"
        }
    }
     );
     return departments;
}

export const getLevels = async (): Promise<ReferenceDTO[]> => {
    const levels = await prisma.level.findMany({
        select: {
            id: true,
            name: true
        },
        orderBy: {
            name: "asc"
        }
    });
    return levels;
}

export const getMinimunPaymentAmount = async (): Promise<number> => {
    const settings = await prisma.adminSetting.findUnique({
        where: {
            id: 1,
        }
    });
    return settings?.minimumPaymentAmount || 0;
}