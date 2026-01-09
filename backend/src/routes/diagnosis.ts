import { Router, Request, Response } from 'express';
import { db } from '../db';
import { diagnosis } from '../db/schema';
import { desc } from 'drizzle-orm';

export const diagnosisRouter = Router();

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
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'enregistrement" });
  }
});

diagnosisRouter.get('/', async (req: Request, res: Response) => {
  try {
    const list = await db.select().from(diagnosis).orderBy(desc(diagnosis.createdAt));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Erreur lecture base de données" });
  }
});