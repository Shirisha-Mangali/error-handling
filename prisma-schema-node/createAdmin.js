//createAdmin.js
import prisma from "./prismaClient.js";

async function main() {
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "bhanuprakash291201@gmail.com",
      role: "ADMIN",
      createdAt: new Date()
    },
  });

  console.log("Admin created:", admin);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
//bhanuprakash291201@gmail.com