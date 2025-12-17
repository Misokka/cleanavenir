export class SavingBankAccountNotFoundError extends Error {
    constructor(savingAccountIdentifier: string) {
        super(`Saving account for Account ${savingAccountIdentifier} not found`);
        this.name = "SavingBankAccountNotFoundError";
    }
}