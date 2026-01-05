import { Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const listAdvisorClientsController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.userId!;

    const container = getContainer();
    const listAdvisorClientsUseCase = container.useCases.loan.listAdvisorClients;
    const advisorRepository = container.repositories.advisor;

    const advisorResult = await advisorRepository.findByUserId(userId);
    if (!advisorResult.ok) {
      res.status(404).json({
        error: 'ADVISOR_NOT_FOUND',
        message: 'Conseiller introuvable',
      });
      return;
    }

    const result = await listAdvisorClientsUseCase.execute({
      advisorIdentifier: advisorResult.value.advisorIdentifier,
    });

    if (!result.ok) {
      res.status(500).json({
        error: 'INTERNAL_ERROR',
        message: result.error.message,
      });
      return;
    }

    // Mapper les entités en DTO
    const loansDTO = result.value.map((loan) => ({
      id: loan.loanIdentifier,
      clientId: loan.clientIdentifier,
      advisorId: loan.advisorIdentifier,
      loanAmount: loan.loanAmount,
      durationInMonth: loan.durationInMonth,
      mensualities: loan.mensualities,
      insuranceMensualities: loan.insuranceMensualities,
      remainingAmountToPay: loan.remainingAmountToPay,
      annualInterestRate: loan.annualInterestRate,
      annualInsuranceRate: loan.annualInsuranceRate,
      status: loan.status,
      createdAt: loan.createdAt.toISOString(),
      lastPaidAt: loan.lastPaidAt instanceof Date && !isNaN(loan.lastPaidAt.getTime()) ? loan.lastPaidAt.toISOString() : undefined,
      nextToPayAt: loan.nextToPayAt instanceof Date && !isNaN(loan.nextToPayAt.getTime()) ? loan.nextToPayAt.toISOString() : undefined,
    }));

    res.json({ loans: loansDTO });
  }
);
