export class IbanGenerator {
  private readonly countryCode = 'FR';
  private readonly ibanLength = 27; 

  generate(): string {
    const bankCode = this.generateRandomDigits(5);
    const branchCode = this.generateRandomDigits(5);
    const accountNumber = this.generateRandomDigits(11);
    const ribKey = this.generateRandomDigits(2);

    const bban = bankCode + branchCode + accountNumber + ribKey;
    const checkDigits = this.calculateCheckDigits(this.countryCode, bban);

    return `${this.countryCode}${checkDigits}${bban}`;
  }

  validate(iban: string): boolean {
    const cleanIban = iban.replace(/\s/g, '');

    if (cleanIban.length !== this.ibanLength) {
      return false;
    }

    const formatRegex = /^FR\d{2}[A-Z0-9]{23}$/;
    if (!formatRegex.exec(cleanIban)) {
      return false;
    }

    return this.checkMod97(cleanIban);
  }

  private calculateCheckDigits(countryCode: string, bban: string): string {
    const rearranged = bban + countryCode + '00';
    
    const numericString = this.replaceLettersWithNumbers(rearranged);
    
    const remainder = this.mod97(numericString);
    
    const checkDigits = 98 - remainder;
    
    return checkDigits.toString().padStart(2, '0');
  }

  private checkMod97(iban: string): boolean {
    const rearranged = iban.substring(4) + iban.substring(0, 4);
    
    const numericString = this.replaceLettersWithNumbers(rearranged);
    
    return this.mod97(numericString) === 1;
  }

  private replaceLettersWithNumbers(str: string): string {
    return str.replace(/[A-Z]/g, (letter: string) => {
      const codePoint = letter.codePointAt(0);
      return codePoint ? (codePoint - 55).toString() : '';
    });
  }

  private mod97(numericString: string): number {
    let remainder = 0;
    
    for (const char of numericString) {
      const digit = Number.parseInt(char, 10);
      remainder = (remainder * 10 + digit) % 97;
    }
    
    return remainder;
  }

  private generateRandomDigits(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  format(iban: string): string {
    const clean = iban.replace(/\s/g, '');
    return clean.match(/.{1,4}/g)?.join(' ') || clean;
  }
}
