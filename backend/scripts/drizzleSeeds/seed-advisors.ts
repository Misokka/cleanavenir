import { eq } from "drizzle-orm";
import { db } from "../../src/infrastructure/drizzle/client";
import { advisors, NewAdvisorDrizzle, users } from "../../src/infrastructure/drizzle/schema";
import { randomUUID } from "crypto";

async function seed(){
  try{
    const now = new Date().toISOString();

    const usersWithRoleAdvisorRows = await db.select({id: users.id }).from(users).where(eq(users.role, "ADVISOR"));

    const advisorsArr: NewAdvisorDrizzle[] = usersWithRoleAdvisorRows.map((user) => {
      return {
        id: randomUUID(),
        userId: user.id,
        createdAt: now,
        updatedAt: now
      }
    });

    await db.insert(advisors).values(advisorsArr);

    console.log("Advisors seed created!")
  } catch (error) {
    console.error("An error occured when inserting advisor seeds", error)
  }
  
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});