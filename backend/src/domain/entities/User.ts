export class User {
  public active: boolean = true;
  public emailVerifiedAt: Date | null = null;
  constructor(
    public userIndentifier: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public password: string,
    public role: "CLIENT" | "ADVISOR" | "DIRECTOR"
  ) { }
}