export class SavingRateNotSetError extends Error {
    constructor() {
        super("Saving rate not set");
        this.name = "SavingRateNotSetError";
    }
}