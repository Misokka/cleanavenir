/**
 * Formate un IBAN avec des espaces tous les 4 caractères
 * @param iban
 * @returns 
 */
export function formatIban(iban: string): string {
  const cleanIban = iban.replaceAll(/\s/g, '');
  
  return cleanIban.match(/.{1,4}/g)?.join(' ') || cleanIban;
}
