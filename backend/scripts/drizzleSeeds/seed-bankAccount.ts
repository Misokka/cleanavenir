import { eq } from "drizzle-orm";
import { db } from "../../src/infrastructure/drizzle/client";
import { bankAccounts, NewBankAccountDrizzle, users } from "../../src/infrastructure/drizzle/schema";
import { randomUUID } from "crypto";

async function seed(){
  try{
    const now = new Date().toISOString();
    const aliceClient = await db.query.users.findFirst({
      where: eq(users.email, "alice@example.com"),
      with: {clientProfile: true}
    });

    if(!aliceClient || !aliceClient.clientProfile) {
      console.log(aliceClient);
      throw new Error("Alice client not found");
    }

    const bankAccountData: NewBankAccountDrizzle = {
      id: randomUUID(),
      ownerId: aliceClient.clientProfile.id,
      name: "Checking Account",
      iban: "FR7630003020540000050608945",
      balance: 500000, // in cents
      createdAt: now,
      updatedAt: now
    }

    await db.insert(bankAccounts).values(bankAccountData);
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