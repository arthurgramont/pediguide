import { Router, Request, Response } from 'express';
import { db } from '../db';
import { doctors } from '../db/schema';
import bcrypt from 'bcrypt';

// Export nommé
export const authRouter = Router();

// POST : Inscription Médecin
authRouter.post('/register', async (req: Request, res: Response): Promise<any> => {
  try {
    const { rpps, email, password, cpsCardUrl } = req.body;

    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Créer le médecin
    const result = await db.insert(doctors).values({
      rpps,
      email,
      passwordHash: hashedPassword,
      cpsCardUrl: cpsCardUrl || null,
    }).returning({ id: doctors.id, email: doctors.email });

    res.json({ success: true, doctor: result[0] });

  } catch (error: any) {
    console.error("Erreur inscription:", error);
    if (error?.code === '23505') { 
        return res.status(400).json({ error: "Ce numéro RPPS ou cet email est déjà utilisé." });
    }
    res.status(500).json({ error: "Erreur serveur lors de l'inscription" });
  }
});