import { randomUUID } from "crypto";
import { UserToPersist } from "../../src/infrastructure/repositories/mappers/PrismaMappers/PrismaUserMapper";
import { SimplePasswordHasher } from "../../src/infrastructure/adapters";
import { getPrismaClient } from "./prismaClient";
import { Advisor, Client, Director, PrismaClient, User } from "@prisma/client";
import { ClientToPersist } from "../../src/infrastructure/repositories/mappers/PrismaMappers/PrismaClientMapper";
import { AdvisorToPersist } from "../../src/infrastructure/repositories/mappers/PrismaMappers/PrismaAdvisorMapper";
import { DirectorToPersist } from "../../src/infrastructure/repositories/mappers/PrismaMappers/PrismaDirectorMapper";
import { exit } from "process";

const prismaClient = getPrismaClient();

async function createUsers(){
  try{
    const hasher = new SimplePasswordHasher();
    const defaultPlainPassword = 'password';
    const hashedDefaultPassword = await hasher.hash(defaultPlainPassword);

    let savedUsers: User[] = []
    const rows: UserToPersist[] = [
      {
        userIdentifier: randomUUID(),
        firstname: 'Alice',
        lastname: 'Dupont',
        email: 'alice@example.com',
        password: hashedDefaultPassword,
        role: 'CLIENT',
        active: true,
        emailVerifiedAt: new Date()
      },
      {
        userIdentifier: randomUUID(),
        firstname: 'Bob',
        lastname: 'Martin',
        email: 'bob@example.com',
        password: hashedDefaultPassword,
        role: 'CLIENT',
        active: true,
        emailVerifiedAt: new Date()
      },
      {
        userIdentifier: randomUUID(),
        firstname: 'Tom',
        lastname: 'François',
        email: 'tom@example.com',
        password: hashedDefaultPassword,
        role: 'ADVISOR',
        active: true,
        emailVerifiedAt: new Date()
      },
      {
        userIdentifier: randomUUID(),
        firstname: 'Didier',
        lastname: 'Douglas',
        email: 'didier@example.com',
        password: hashedDefaultPassword,
        role: 'ADVISOR',
        active: true,
        emailVerifiedAt: new Date()
      },
      {
        userIdentifier: randomUUID(),
        firstname: 'Patrick',
        lastname: 'Leboss',
        email: 'pat@example.com',
        password: hashedDefaultPassword,
        role: 'DIRECTOR',
        active: true,
        emailVerifiedAt: new Date()
      },
      {
        userIdentifier: randomUUID(),
        firstname: 'SYSTEM',
        lastname: 'SYSTEM',
        email: 'sys@example.com',
        password: hashedDefaultPassword,
        role: 'CLIENT',
        active: true,
        emailVerifiedAt: new Date()
      },
    ];
    
    for(const userRow of rows){
      const saved = await prismaClient.user.create({
        data: userRow
      });

      savedUsers.push(saved);
      console.log("saved user:", saved.userIdentifier)
    }

    return savedUsers;
  } catch (error) {
    throw error;
  }
}

async function createAdvisors(users: User[]){
  try{
    const savedAdvisors: Advisor[] = []
    for(const user of users) {
      if(user.role === "ADVISOR"){
        const advisorToPersist: AdvisorToPersist = {
          advisorIdentifier: randomUUID(),
          userIdentifier: user.userIdentifier
        }

        const saved = await prismaClient.advisor.create({
          data: advisorToPersist
        })

        savedAdvisors.push(saved);
        console.log("saved advisor:", saved.advisorIdentifier)
      }
    }

    return savedAdvisors
  } catch (error) {
    throw error;
  }
}

async function createDirectors(users: User[]){
  try{
    const savedDirectors: Director[] = []
    for(const user of users){
      if(user.role === "DIRECTOR"){
        const directorToPersist: DirectorToPersist = {
          directorIdentifier: randomUUID(),
          userIdentifier: user.userIdentifier
        }

        const saved = await prismaClient.director.create({
          data: directorToPersist
        });

        savedDirectors.push(saved);
        console.log("saved director:", saved.directorIdentifier)
      }
    }

    return savedDirectors;
  } catch (error) {
    throw error;
  }
  
}

async function createClients(users: User[], advisors: Advisor[]){
  try{
    const savedClients: Client[] = [] 
    for(const user of users){
      if(user.role === "CLIENT"){
        const clientToPersist: ClientToPersist = {
          clientIdentifier: randomUUID(),
          userIdentifier: user.userIdentifier,
          advisorIdentifier: advisors[Math.floor(Math.random() * advisors.length)].advisorIdentifier,
        }

        const saved = await prismaClient.client.create({
          data: clientToPersist
        });

        savedClients.push(saved);
        console.log("saved client:", saved.clientIdentifier)
      }
    }
  } catch (error) {
    throw error
  }
  
}

async function seed(){
  try{
    const users = await createUsers();
    const advisors = await createAdvisors(users);
    const directors = await createDirectors(users);
    const clients = await createClients(users, advisors);
  } catch (error) {
    throw error;
  }
}

seed();