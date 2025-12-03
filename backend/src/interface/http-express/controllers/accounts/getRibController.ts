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
  const accountResult = await container.useCases.account.get.execute({ userId, accountId });

  console.log('[RIB] Résultat compte:', accountResult.ok ? 'OK' : 'ERREUR', accountResult.ok ? '' : accountResult.error);

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
  const user = userResult.value;
  
  const holderName = `${user.firstname} ${user.lastname}`;
  const iban = account.iban;
  const bic = 'CLEANFRPPXXX';
  const bankName = 'Clean Avenir';
  const accountLabel = account.name ?? account.label ?? 'Compte';

  // Générer le PDF
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  // Headers pour le téléchargement PDF
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="RIB-${accountLabel.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);

  doc.pipe(res);

  // En-tête avec logo/titre
  doc.fontSize(24).font('Helvetica-Bold').fillColor('#2563eb').text(bankName, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(16).font('Helvetica').fillColor('#374151').text('Relevé d\'Identité Bancaire (RIB)', { align: 'center' });
  doc.moveDown(2);

  // Ligne de séparation
  doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(1.5);

  // Informations du compte
  const startY = doc.y;
  
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#1f2937').text('Titulaire du compte');
  doc.fontSize(12).font('Helvetica').fillColor('#4b5563').text(holderName);
  doc.moveDown(1);

  doc.fontSize(12).font('Helvetica-Bold').fillColor('#1f2937').text('Libellé du compte');
  doc.fontSize(12).font('Helvetica').fillColor('#4b5563').text(accountLabel);
  doc.moveDown(1);

  doc.fontSize(12).font('Helvetica-Bold').fillColor('#1f2937').text('Banque');
  doc.fontSize(12).font('Helvetica').fillColor('#4b5563').text(bankName);
  doc.moveDown(1.5);

  // Ligne de séparation
  doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown(1.5);

  // IBAN et BIC dans un cadre
  doc.rect(50, doc.y, 495, 80).strokeColor('#2563eb').lineWidth(2).stroke();
  doc.moveDown(0.5);
  
  const ibanFormatted = iban.replace(/(.{4})/g, '$1 ').trim();
  
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#1f2937').text('IBAN', 70);
  doc.fontSize(14).font('Helvetica').fillColor('#1f2937').text(ibanFormatted, 70);
  doc.moveDown(0.5);
  
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#1f2937').text('BIC / SWIFT', 70);
  doc.fontSize(14).font('Helvetica').fillColor('#1f2937').text(bic, 70);
  doc.moveDown(2);

  // Pied de page
  doc.fontSize(10).font('Helvetica').fillColor('#9ca3af').text(
    `Document généré le ${new Date().toLocaleDateString('fr-FR')} - ${bankName}`,
    { align: 'center' }
  );

  doc.end();
});