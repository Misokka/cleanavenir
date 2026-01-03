export function getOperationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    TRANSFER: 'Virement',
    LOAN_PAYMENT: 'Prêt',
    STOCK_PURCHASE: 'Bourse',
    STOCK_SALE: 'Bourse',
    SAVINGS_INTEREST: 'Intérêts',
    INITIAL_DEPOSIT: 'Dépôt initial',
  };
  return labels[type] || type;
}

export function getOperationTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    TRANSFER: '',
    LOAN_PAYMENT: '',
    STOCK_PURCHASE: '',
    STOCK_SALE: '',
    SAVINGS_INTEREST: '',
    INITIAL_DEPOSIT: '',
  };
  return icons[type] || '';
}

export function getPaymentMethod(type: string, isCredit: boolean): string {
  if (type === 'TRANSFER') {
    return isCredit ? 'Virement reçu' : 'Virement émis';
  }
  if (type === 'LOAN_PAYMENT') {
    return 'Prélèvement';
  }
  if (type === 'STOCK_PURCHASE') {
    return 'Achat';
  }
  if (type === 'STOCK_SALE') {
    return 'Vente';
  }
  if (type === 'SAVINGS_INTEREST') {
    return 'Automatique';
  }
  if (type === 'INITIAL_DEPOSIT') {
    return 'Dépôt';
  }
  return 'Autre';
}

export function getOperationDescription(op: {
  label: string;
  type: string;
  fromAccountLabel?: string;
  toAccountLabel?: string;
  isCredit: boolean;
}): string {
  if (op.type === 'TRANSFER') {
    if (op.isCredit && op.fromAccountLabel) {
      return `Reçu de ${op.fromAccountLabel}`;
    } else if (!op.isCredit && op.toAccountLabel) {
      return `Vers ${op.toAccountLabel}`;
    } else {
      return op.label;
    }
  }
  
  return op.label || 'Opération';
}
