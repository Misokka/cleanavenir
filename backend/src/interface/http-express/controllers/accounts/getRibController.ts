import { Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { asyncHandler } from '../../middlewares/errorMiddleware';
import { getContainer } from '../../../../infrastructure/bootstrap/instance';

export const getRibController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId!;
  const accountId = req.params.id;

  console.log('[RIB] Requête reçue - userId:', userId, 'accountId:', accountId);

  const container = getContainer();
  
  // Récupérer le compte
  const accountResult = await container.useCases.bankAccount.get.execute({ userId, accountId });

  if (!accountResult.ok) {
    res.status(404).json({ error: 'NOT_FOUND', message: accountResult.error.message });
    return;
  }

  // Récupérer les infos utilisateur pour le nom/prénom
  const userResult = await container.useCases.auth.getUserProfile.execute(userId);
  
  if (!userResult.ok) {
    res.status(404).json({ error: 'USER_NOT_FOUND', message: 'Utilisateur non trouvé' });
    return;
  }

  const account = accountResult.value;
  // Récupérer les infos du titulaire (prénom + nom)
  let holderName = 'Client';
  try {
    const userResult = await container.repositories.user.findById(userId);
    if (userResult.ok) {
      holderName = `${userResult.value.firstname} ${userResult.value.lastname}`;
    }
  } catch {
    // En cas d'erreur, on garde un intitulé générique
  }

  const iban = account.iban;
  const bic = 'CLEANFRPPXXX';
  const bankName = 'Clean Avenir';
  const accountLabel = account.label;

  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=\"CleanAvenir-RIB-${accountId}.pdf\"`
  );

  doc.pipe(res);

  const today = new Date().toLocaleDateString('fr-FR');

  // En-tête
  doc
    .fontSize(20)
    .text('Relevé d\'Identité Bancaire', { align: 'center' })
    .moveDown(0.5);

  doc
    .fontSize(12)
    .text(bankName, { align: 'center' })
    .moveDown(1.5);

  // Infos banque et titulaire sur deux colonnes simples
  const startY = doc.y;
  doc
    .fontSize(12)
    .text('Établissement', 50, startY, { bold: true })
    .moveDown(0.5);
  doc.text(bankName);
  doc.text('Banque en ligne');
  doc.moveDown(1);

  doc.text('Titulaire du compte', 320, startY, { bold: true });
  doc.moveDown(0.5);
  
  const ibanFormatted = iban.value.replace(/(.{4})/g, '$1 ').trim();
  
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#1f2937').text('IBAN', 70);
  doc.fontSize(14).font('Helvetica').fillColor('#1f2937').text(ibanFormatted, 70);
  doc.moveDown(0.5);
  
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#1f2937').text('BIC / SWIFT', 70);
  doc.fontSize(14).font('Helvetica').fillColor('#1f2937').text(bic, 70);
  doc.moveDown(2);

  // Bloc RIB
  doc.fontSize(14).text('Coordonnées bancaires', { underline: true });
  doc.moveDown(1);

  doc.fontSize(12).text(`IBAN : ${iban}`);
  doc.text(`BIC : ${bic}`);
  doc.moveDown(1.5);

  // Date et mention
  doc.text(`Document généré le : ${today}`);
  doc.moveDown(1);
  doc.fontSize(9).fillColor('gray').text('Ce document est édité par CleanAvenir à titre informatif.', {
    align: 'left',
  });

  doc.fillColor('black');

  doc.end();
});