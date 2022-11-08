import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
function main() {
  [...Array.from(Array(20).keys())].forEach(async (item) => {
    await client.stream.create({
      data: {
        product: {
          connect: {
            id: 8,
          },
        },
        user: {
          connect: {
            id: 4,
          },
        },
      },
    });
    console.log(`${item}/500`);
  });
  console.log("completed");
}
main();
