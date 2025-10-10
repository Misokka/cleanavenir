export class EpargneAccountNotFoundError extends Error {
    constructor(public readonly compteId: string) {
        super(`Epargne account for compte ${compteId} not found`);
        this.name = "EpargneAccountNotFoundError";
    }
}