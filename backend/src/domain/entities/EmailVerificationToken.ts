export class EmailVerificationToken {
  private constructor(
    public readonly tokenIdentifier: string,
    public readonly userIdentifier: string,
    public readonly tokenHash: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public usedAt: Date | null = null
  ) {}

  public static create(props: {
    tokenIdentifier: string;
    userIdentifier: string;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
    usedAt?: Date | null;
  }): EmailVerificationToken {
    return new EmailVerificationToken(
      props.tokenIdentifier,
      props.userIdentifier,
      props.tokenHash,
      props.expiresAt,
      props.createdAt,
      props.usedAt ?? null
    );
  }

  public isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  public isUsed(): boolean {
    return this.usedAt !== null;
  }

  public markAsUsed(): void {
    this.usedAt = new Date();
  }
}
