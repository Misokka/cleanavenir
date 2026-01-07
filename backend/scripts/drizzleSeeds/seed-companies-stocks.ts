import 'dotenv/config';
import { randomUUID } from 'crypto';
import { db } from '../../src/infrastructure/drizzle/client';
import { companies, NewCompanyDrizzle, NewStockDrizzle, stocks } from '../../src/infrastructure/drizzle/schema';

type Company = {
  name: string;
  description: string;
}

async function seedCompanies(){
  const companiesObj: Company[] = [
    { name: 'Apple Inc.', description: 'A leading company in tech innovations.' },
    { name: 'Amazon Inc.', description: 'Best retailer of the world.' },
    { name: 'Google Inc.', description: 'Leading search engine and technology company.' },
    { name: 'Tesla Inc.', description: 'Electric vehicle and energy company.' },
    { name: 'Microsoft', description: 'Leading software and cloud computing company.' },
  ];

  companiesObj.forEach(async (company) => {
    try{
      const companyToInsert : NewCompanyDrizzle = {
        id: randomUUID(),
        name: company.name,
        description: company.description,
      }

      await db.insert(companies).values(companyToInsert);
      console.log(`Inserted ${company.name}`);
    } catch (e: any) {
      console.warn(`Could not insert ${company.name}:`, e.message);
    }
  })
}

function tickerPicker(companyName: string): string {
  const mapping: { [key: string]: string } = {
    'Apple Inc.': 'AAPL',
    'Amazon Inc.': 'AMZN',
    'Google Inc.': 'GOOGL',
    'Tesla Inc.': 'TSLA',
    'Microsoft': 'MSFT',
  };

  return mapping[companyName] || 'UNKNOWN';
}

async function seedStocks(){
  const now = new Date().toISOString();

  const dbCompanies = await db.select().from(companies);
  if(dbCompanies.length === 0){
    console.error('No companies found in the database. Please seed companies first.');
    return;
  }

  dbCompanies.forEach(async (company) => {
    const stockToInsert: NewStockDrizzle = {
      id: randomUUID(),
      companyId: company.id,
      ticker: tickerPicker(company.name),
      price: parseFloat((Math.random() * 300 + 100).toFixed(2)) * 100, // Random price between 100 and 400 and convert to cents
      isAvailable: 1,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await db.insert(stocks).values(stockToInsert);
      console.log(`Inserted ${stockToInsert.ticker}`);
    } catch (e: any) {
      console.warn(`Could not insert ${stockToInsert.ticker}:`, e.message);
    }
  });
}

async function seed() {
  await seedCompanies();
  await seedStocks();

  console.log('Stock seeding done');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
