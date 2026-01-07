import { eq } from "drizzle-orm";
import { db } from "../../src/infrastructure/drizzle/client";
import { NewSavingProductDrizzle, savingProducts } from "../../src/infrastructure/drizzle/schema";
import { randomUUID } from "crypto";

async function seed(){
  try{

    const savingProduct1: NewSavingProductDrizzle = {
      id: randomUUID(),
      label: "Livret A",
      rate: 1.75 * 1_000_000, // en micro pourcent
      rateUpdatedAt: new Date().toISOString(),
    }

    const savingProduct2: NewSavingProductDrizzle = {
      id: randomUUID(),
      label: "PEL",
      rate: 3 * 1_000_000, // en micro pourcent
      rateUpdatedAt: new Date().toISOString(),
    }

    const savingProduct3: NewSavingProductDrizzle = {
      id: randomUUID(),
      label: "LLDS",
      rate: 2.3 * 1_000_000, // en micro pourcent
      rateUpdatedAt: new Date().toISOString(),
    }

    await db.insert(savingProducts).values(savingProduct1);
    await db.insert(savingProducts).values(savingProduct2);
    await db.insert(savingProducts).values(savingProduct3);
    console.log("saving products seeding done");
  } catch (error){
    console.error("An error occured when seeding saving products", error)
  }
  
  process.exit(0)
}

seed().catch((error) => {
  console.error(error);
  process.exit(1)
})