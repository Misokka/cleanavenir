import { post } from "../api";
import { LoginDTO } from "./login.dto";
import { RegisterDTO } from "./register.dto";

export async function login(credentials: LoginDTO){
  const response = await post("/auth/login", credentials);
  return response;
}

export async function register(data: RegisterDTO){
  const response = await post("/auth/register", data);
  return response;
}