export class User{
  constructor(
    public userIndentifier: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public password: string,
    public role: "CLIENT" | "ADVISOR" | "DIRECTOR"
  ){}
}