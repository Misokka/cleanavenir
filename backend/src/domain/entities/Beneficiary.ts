import { Iban } from "../value-objects/Iban";

export class Beneficiary {
  private constructor(
    public readonly beneficiaryIdentifier: string,
    public readonly clientIdentifier: string,
    public readonly iban: Iban,
    public readonly label: string,
    public readonly createdAt: Date,
    public readonly accountName?: string
  ) {}

  public static create(props: {
    beneficiaryIdentifier: string;
    clientIdentifier: string;
    iban: Iban;
    label: string;
    createdAt?: Date;
    accountName?: string;
  }): Beneficiary {
    const trimmedLabel = props.label.trim();
    
    if (!trimmedLabel || trimmedLabel.length < 2) {
      throw new Error('Le label du bénéficiaire doit contenir au moins 2 caractères');
    }

    return new Beneficiary(
      props.beneficiaryIdentifier,
      props.clientIdentifier,
      props.iban,
      trimmedLabel,
      props.createdAt || new Date(),
      props.accountName
    );
  }
}
