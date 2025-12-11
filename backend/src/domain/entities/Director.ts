export class Director{
  constructor(
    public directorIdentifier: string,
    public userIdentifier: string
  ){}

  public static create(props: {
    directorIdentifier: string;
    userIdentifier: string;
  }): Director {
    return new Director(
      props.directorIdentifier,
      props.userIdentifier
    );
  }
}