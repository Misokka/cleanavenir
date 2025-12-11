export class Client{
  private constructor(
    public clientIdentifier: string,
    public userIdentifier: string,
  ){}

  public static create(props: {
    clientIdentifier: string;
    userIdentifier: string;
  }): Client {
    return new Client(
      props.clientIdentifier,
      props.userIdentifier
    );
  }
}