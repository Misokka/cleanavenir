import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
// No container use case available: compute simulation inline

export const simulateLoanController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { amount, durationInMonth, annualInterestRate, annualInsuranceRate } = req.body;

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

    // Inputs: amount (in cents), rates in basis points (100 = 1%)
    const principal = amount; // cents
    const n = durationInMonth;
    const rMonthly = (annualInterestRate / 100) / 12 / 100; // basis points -> percent -> monthly
    const insuranceMonthlyRate = (annualInsuranceRate / 100) / 12 / 100;

    const monthlyPaymentWithoutInsurance = rMonthly > 0
      ? Math.round(principal * (rMonthly / (1 - Math.pow(1 + rMonthly, -n))))
      : Math.round(principal / n);

    const insuranceMonthly = Math.round(principal * insuranceMonthlyRate);
    const monthlyPayment = monthlyPaymentWithoutInsurance + insuranceMonthly;

    const totalCost = monthlyPayment * n;
    const totalInterest = Math.max(totalCost - principal - insuranceMonthly * n, 0);
    const totalInsurance = insuranceMonthly * n;

    res.json({
      simulation: {
        monthlyPayment,
        totalCost,
        totalInterest,
        totalInsurance,
      },
    });
  }
);
