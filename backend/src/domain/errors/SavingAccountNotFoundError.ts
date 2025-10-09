export class SavingAccountNotFoundError extends Error {
    constructor(public readonly AccountId: string) {
        super(`Saving account for Account ${AccountId} not found`);
        this.name = "SavingAccountNotFoundError";
    }
}