export class Advisor{
  private constructor(
    public advisorIdentifier: string,
    public userIdentifier: string
  ){}

  public static create(props: {
    advisorIdentifier: string;
    userIdentifier: string;
  }): Advisor {
    return new Advisor(
      props.advisorIdentifier,
      props.userIdentifier
    );
  }
}