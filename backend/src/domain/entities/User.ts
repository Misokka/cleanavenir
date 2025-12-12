export class User {
  public active: boolean = true;
  public emailVerifiedAt: Date | null = null;
  private constructor(
    public userIdentifier: string,
    public firstname: string,
    public lastname: string,
    public email: string,
    public password: string,
    public role: "CLIENT" | "ADVISOR" | "DIRECTOR"
  ) { }

  public static create(props: {
    userIdentifier: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: "CLIENT" | "ADVISOR" | "DIRECTOR";
    active?: boolean;
    emailVerifiedAt?: Date | null;
  }): User {
    const user = new User(
      props.userIdentifier,
      props.firstname,
      props.lastname,
      props.email,
      props.password,
      props.role
    );

    if (props.active !== undefined) {
      user.active = props.active;
    }

    if (props.emailVerifiedAt !== undefined) {
      user.emailVerifiedAt = props.emailVerifiedAt;
    }

    return user;
  }
}