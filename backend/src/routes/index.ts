import express from 'express';
import { db } from '../db';
import { formulaires } from '../db/schema'; 

export const router = express.Router();

router.post('/submit', async (req, res) => {
    try {
        const data = req.body;

        const resultat = await db.insert(formulaires).values({
            prenomEnfant: data.prenom,
            age: parseInt(data.age),
            sexe: data.sexe,
            symptomes: data.description,
            douleur: data.niveauDouleur,
            emailParent: data.email
        }).returning({ id: formulaires.id });

        console.log("✅ Sauvegardé :", resultat[0].id);
        
        res.status(200).json({ success: true, id: resultat[0].id });

    } catch (error) {
        console.error("❌ Erreur Drizzle", error);
        res.status(500).json({ success: false, error: "Erreur serveur" });
    }
});