import { Router, Request, Response } from 'express';
import { db } from '../db';
import { diagnosis } from '../db/schema';
import { desc } from 'drizzle-orm';

// Export nommé (nécessaire pour l'import { diagnosisRouter })
export const diagnosisRouter = Router();

// POST : Le parent envoie le formulaire
diagnosisRouter.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    
    const result = await db.insert(diagnosis).values({
      childFirstName: data.childFirstName,
      childBirthDate: data.childBirthDate,
      consultationReason: data.consultationReason,
      
      // On force le type en tableau de strings pour Drizzle
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

// GET : Le médecin récupère la liste
diagnosisRouter.get('/', async (req: Request, res: Response) => {
  try {
    const list = await db.select().from(diagnosis).orderBy(desc(diagnosis.createdAt));
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: "Erreur lecture base de données" });
  }
});