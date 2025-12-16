export class SavingProduct{
  private constructor(
    public savingProductIdentifier: string,
    public label: string,
    public rate: number
  ){}

  public static create(props: {
    savingProductIdentifier: string,
    label: string,
    rate: number
  }): SavingProduct {
    return new SavingProduct(
      props.savingProductIdentifier,
      props.label,
      props.rate
    );
  }
}