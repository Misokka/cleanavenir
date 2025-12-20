import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const getRibController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const accountId = req.params.id;

  const container = getContainer();
  const accountResult = await container.useCases.account.get.execute({ userId, accountId });

  if (!accountResult.ok) {
    res.status(404).json({ error: 'NOT_FOUND', message: accountResult.error.message });
    return;
  }

  const account = accountResult.value;

  const holderName = account.ownerName ?? 'Client';
  const iban = account.iban;
  const bic = 'CLEANFRPPXXX';
  const bankName = 'Clean Avenir';
  const accountLabel = account.name ?? account.label ?? 'Compte';

  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="RIB-${accountId}.pdf"`
  );

  doc.pipe(res);

  doc.fontSize(18).text('Relevé d\'Identité Bancaire', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Banque : ${bankName}`);
  doc.text(`Titulaire : ${holderName}`);
  doc.text(`Libellé du compte : ${accountLabel}`);
  doc.moveDown();
  doc.text(`IBAN : ${iban}`);
  doc.text(`BIC : ${bic}`);

  doc.end();
});