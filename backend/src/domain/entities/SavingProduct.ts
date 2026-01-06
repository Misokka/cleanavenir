export class SavingProduct{
  private constructor(
    public savingProductIdentifier: string,
    public label: string,
    public rate: number,
    public rateUpdatedAt?: string | null
  ){}

  public static create(props: {
    savingProductIdentifier: string,
    label: string,
    rate: number,
    rateUpdatedAt?: string | null
  }): SavingProduct {
    return new SavingProduct(
      props.savingProductIdentifier,
      props.label,
      props.rate,
      props.rateUpdatedAt
    );
  }
}