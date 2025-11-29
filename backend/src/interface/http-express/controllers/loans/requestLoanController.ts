import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';
import crypto from 'crypto';

export const requestLoanController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { amount, durationInMonth, annualInterestRate, annualInsuranceRate } = req.body;
    const clientId = req.userId!; // Fourni par requireAuth

    // Validation
    if (!amount || !durationInMonth || annualInterestRate === undefined || annualInsuranceRate === undefined) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Tous les champs sont requis: amount, durationInMonth, annualInterestRate, annualInsuranceRate',
      });
      return;
    }

    if (amount <= 0 || durationInMonth <= 0) {
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Le montant et la durée doivent être supérieurs à 0',
      });
      return;
    }

    const container = getContainer();
    const loanRepository = container.repositories.loan;

    // Calcul simplifié de la mensualité (hors assurance)
    const monthlyRate = annualInterestRate / 12 / 100;
    const n = durationInMonth;
    const principal = amount;
    const monthlyPayment = monthlyRate > 0
      ? Math.round(principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -n))))
      : Math.round(principal / n);

    const loan = {
      id: crypto.randomUUID(),
      clientId,
      principal,
      annualRate: Math.round(annualInterestRate),
      termMonths: n,
      monthlyPayment,
      outstanding: principal,
      createdAt: new Date().toISOString(),
    };

    const saveResult = await loanRepository.save(loan as any);

    if (!saveResult.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: saveResult.error.message,
      });
      return;
    }

    res.status(201).json({
      message: 'Demande de prêt créée avec succès',
      loan: saveResult.value,
    });
  }
);
