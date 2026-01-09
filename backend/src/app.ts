import dotenv from 'dotenv';
// 1. D'ABORD : On charge les variables d'environnement
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';

// 👇 IMPORTANT : On utilise les accolades car on a fait des "export const"
// import { diagnosisRouter } from './routes/diagnosis';
// import { authRouter } from './routes/auth';

console.log("🔄 Initialisation du serveur...");

if (!process.env.DATABASE_URL) {
  console.error("❌ ERREUR FATALE : DATABASE_URL est introuvable dans le .env !");
  process.exit(1);
} else {
  console.log("✅ DATABASE_URL détectée.");
}

const app = express();

app.use(cors({origin: '*'}));
app.use(express.json());

// Le mouchard
// app.use((req: Request, res: Response, next) => {
//   console.log(`📥 REQUÊTE REÇUE : ${req.method} ${req.originalUrl}`);
//   next();
// });

// Route de test
app.get('/ping', (req: Request, res: Response) => {
  res.send('PONG ! Le serveur est vivant.');
});

// Routes API
// app.use('/api/diagnosis', diagnosisRouter);
// app.use('/api/auth', authRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Serveur PRÊT sur http://localhost:${port}`);
    console.log(`👉 Teste moi avec : curl http://localhost:${port}/ping`);
});

export default app