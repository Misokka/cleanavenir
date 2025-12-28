import { eq } from "drizzle-orm";
import { db } from "../../src/infrastructure/drizzle/client";
import { bankAccounts, NewBankAccountDrizzle, users } from "../../src/infrastructure/drizzle/schema";
import { randomUUID } from "crypto";

async function seed(){
  try{
    const now = new Date().toISOString();
    const validIBANS = [
      "FR7630003020540000050608945",
      "FR7630006000011234567890189",
      "FR7630041010051234567890143"
    ];

    const clientUsers = await db.query.users.findMany({
      where: eq(users.role, "CLIENT"),
      with: {clientProfile: true}
    });

    if(!clientUsers || clientUsers.length === 0) {
      console.log(clientUsers);
      throw new Error("No user with CLIENT role found. Cannot seed bank accounts.");
    }

    for (const [index, client] of clientUsers.entries()) {
      
      if (!validIBANS[index]) {
        console.warn(`No IBAN available for client ${client.email}, skipping.`);
        continue;
      }

      const bankAccountData: NewBankAccountDrizzle = {
        id: randomUUID(),
        ownerId: client.clientProfile.id,
        name: "Checking Account",
        iban: validIBANS[index],
        balance: 500000, 
        createdAt: now,
        updatedAt: now
      };

      await db.insert(bankAccounts).values(bankAccountData);
      console.log(`Bank account created for client: ${client.email}`);
    }
    console.log("Bank account seeding done");
  } catch (error){
    console.error("An error occured when seeding bank accounts", error)
  }
  
  process.exit(0)
}

seed().catch((error) => {
  console.error(error);
  process.exit(1)
})