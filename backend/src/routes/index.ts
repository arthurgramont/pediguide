import express, { Request, Response } from 'express';
import { db } from '../db';        // Assure-toi que cet import pointe bien vers ton fichier db/index.ts
import { diagnosis } from '../db/schema'; // Import de la définition de la table

export const router = express.Router();

// J'ai changé '/submit' en '/' car dans ton app.ts tu as sûrement mis : app.use('/api/diagnosis', ...)
// Donc l'URL finale sera : http://localhost:3000/api/diagnosis
router.post('/', async (req: Request, res: Response) => {
    try {
        const data = req.body;

        // On insère les données en utilisant les NOUVEAUX noms de colonnes
        const resultat = await db.insert(diagnosis).values({
            // 1. L'Enfant
            childFirstName: data.childFirstName,
            childBirthDate: data.childBirthDate,
            consultationReason: data.consultationReason,

            // 2. Les Tableaux (Cases à cocher)
            // On s'assure que ce sont bien des tableaux de chaînes de caractères
            behaviorChanges: (data.behaviorChanges || []) as string[],
            clinicalSigns: (data.clinicalSigns || []) as string[],

            // 3. Durée et inquiétude
            duration: data.duration,
            worryLevel: data.worryLevel,

            // 4. Actions
            actionsTaken: (data.actionsTaken || []) as string[],

            // 5. Notes
            additionalNotes: data.additionalNotes || ""
        }).returning({ id: diagnosis.id });

        console.log("✅ Sauvegardé avec succès, ID :", resultat[0].id);
        
        res.status(200).json({ success: true, id: resultat[0].id });

    } catch (error) {
        console.error("❌ Erreur lors de l'insertion Drizzle :", error);
        res.status(500).json({ success: false, error: "Erreur serveur lors de la sauvegarde" });
    }
});