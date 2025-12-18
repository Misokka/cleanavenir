export type SavingAccountDTO = {
    id: string;
    iban: string;
    ownerId: string,
    savingProductId: string;
    label: string;
    balance: number
}