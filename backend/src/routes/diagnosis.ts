import { Router, Request, Response } from 'express';
import PDFDocument from 'pdfkit';
import { desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { diagnosis } from '../db/schema';

export const diagnosisRouter = Router();

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatTextValue = (value?: string | null) => {
  if (!value) return 'Non renseigné';
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : 'Non renseigné';
};

const formatListValue = (value?: string[] | null) => {
  if (!value || value.length === 0) return 'Non renseigné';
  return value.join(', ');
};

diagnosisRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    const result = await db.insert(diagnosis).values({
      childFirstName: data.childFirstName,
      childBirthDate: data.childBirthDate,
      consultationReason: data.consultationReason,
      
      behaviorChanges: (data.behaviorChanges || []) as string[],
      clinicalSigns: (data.clinicalSigns || []) as string[],
      
      duration: data.duration,
      worryLevel: data.worryLevel,
      
      actionsTaken: (data.actionsTaken || []) as string[],
      additionalNotes: data.additionalNotes || ""
    }).returning({ id: diagnosis.id });

    res.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error("Détail de l'erreur", error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement" });
  }
});

diagnosisRouter.get('/:id/pdf', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Identifiant manquant' });
    }

    const results = await db.select().from(diagnosis).where(eq(diagnosis.id, id)).limit(1);
    const record = results[0];

    if (!record) {
      return res.status(404).json({ error: 'Diagnostic introuvable' });
    }

    const fileDate = formatDate(new Date());
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="pediguide-compte-rendu-${fileDate}.pdf"`);

    const doc = new PDFDocument({ size: 'A4', margin: 48 });
    doc.pipe(res);

    doc.fontSize(18).text('PediGuide - Compte rendu', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Identifiant: ${record.id ?? id}`);
    doc.text(`Date: ${formatDate(record.createdAt ? new Date(record.createdAt) : new Date())}`);
    doc.moveDown();

    doc.font('Helvetica-Bold').text('Informations patient');
    doc.font('Helvetica').text(`Prénom: ${formatTextValue(record.childFirstName)}`);
    doc.text(`Date de naissance: ${formatTextValue(record.childBirthDate)}`);
    doc.text(`Motif de consultation: ${formatTextValue(record.consultationReason)}`);
    doc.moveDown();

    doc.font('Helvetica-Bold').text('Observations');
    doc.font('Helvetica').text(`Changements de comportement: ${formatListValue(record.behaviorChanges as string[] | null)}`);
    doc.text(`Signes cliniques: ${formatListValue(record.clinicalSigns as string[] | null)}`);
    doc.text(`Durée des symptômes: ${formatTextValue(record.duration)}`);
    doc.text(`Niveau d'inquiétude: ${formatTextValue(record.worryLevel)}`);
    doc.moveDown();

    doc.font('Helvetica-Bold').text('Actions et notes');
    doc.font('Helvetica').text(`Actions entreprises: ${formatListValue(record.actionsTaken as string[] | null)}`);
    doc.text(`Message complémentaire: ${formatTextValue(record.additionalNotes)}`);

    doc.end();
  } catch (error) {
    console.error("DÃ©tail de l'erreur", error);
    res.status(500).json({ error: "Erreur lors de la gÃ©nÃ©ration du PDF" });
  }
});

diagnosisRouter.get('/', async (req: Request, res: Response) => {
  try {
    const list = await db.select().from(diagnosis).orderBy(desc(diagnosis.createdAt));
    res.json(list);
  } catch (error) {
    console.error("Détail de l'erreur", error);
    res.status(500).json({ error: "Erreur lecture base de données" });
  }
});
