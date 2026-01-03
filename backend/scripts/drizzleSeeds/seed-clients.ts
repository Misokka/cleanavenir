import { eq, or } from "drizzle-orm";
import { db } from "../../src/infrastructure/drizzle/client";
import { advisors, clients, NewClientDrizzle, users } from "../../src/infrastructure/drizzle/schema";
import { randomUUID } from "crypto";

async function seed(){
  try {
    const now = new Date().toISOString();
    const usersWithRoleClientRows = await db.select({id: users.id }).from(users).where(eq(users.role, "CLIENT"));
    const advisorsRows = await db.select({id: advisors.id}).from(advisors);

    const clientsArr: NewClientDrizzle[] = usersWithRoleClientRows.map((user) => {
      const randomAdvisor = advisorsRows[Math.floor(Math.random() * advisorsRows.length)]
      return {
        id: randomUUID(),
        userId: user.id,
        advisorId: randomAdvisor.id,
        createdAt: now,
        updatedAt: now
      }
    });

    await db.insert(clients).values(clientsArr);
    console.log("Client seeding done");
  } catch (error) {
    console.error("An error occured when seeding clients", error)
  }

  process.exit(0)
}

seed().catch((error) => {
  console.error(error);
  process.exit(1)
})