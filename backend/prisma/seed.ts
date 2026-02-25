import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import "dotenv/config";

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
    console.log("Seeding database...");

    const departments = [
        {name: "Bilingual Letters"},
        {name: "Biology"},
        {name: "Chemistry"},
        {name: "Computer Science"},
        {name: "Economics"},
        {name: "English Modern Letters"},
        {name: "French Modern Letters"},
        {name: "Geography"},
        {name: "Geology"},
        {name: "Guidance and Counseling"},
        {name: "History"},
        {name: "Mathematics"},
        {name: "Philosophy"},
        {name: "Physics"},
        {name: "Science of Education"}
    ];

    for (const dept of departments){
        await prisma.department.upsert({
            where: {name: dept.name},
            update: {},
            create: dept
        });
    }

    const levels = [
        {name: '200'},
        {name: '300'},
        {name: '400'},
        {name: '500'},
        {name: '600'},
    ];
    for (const level of levels){
        await prisma.level.upsert({
            where: {name: level.name},
            update: {},
            create: level
        });
    }

    await prisma.schoolYear.upsert({
        where: {name: "2025/2026"},
        update: {isActive: true},
        create: {name: "2025/2026", isActive: true}
    });

    await prisma.adminSetting.upsert({
        where: {id: 1},
        update: {},
        create: {
            id: 1,
            minimumPaymentAmount: 3500
        }
    });

    const hashedPassword = await bcrypt.hash('httcpay2025', 10);

    await prisma.admin.upsert({
        where: {username: 'httc@admin2025' },
        update: {},
        create: {
            username: 'httc@admin2025',
            password: hashedPassword
        }
    });

    console.log("Database seeded successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () =>{
        await prisma.$disconnect();
    });
