export class Company{
  private constructor(
    public readonly companyIdentifier: string,
    public name: string,
    public description: string
  ){}

  public static create(props: {
    companyIdentifier: string,
    name: string,
    description: string
  }): Company{
    return new Company(
      props.companyIdentifier,
      props.name,
      props.description
    )
  }
}