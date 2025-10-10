export class EpargneRateNotSetError extends Error {
    constructor() {
        super("Epargne rate not set");
        this.name = "EpargneRateNotSetError";
    }
}