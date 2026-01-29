import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';

import { diagnosisRouter } from './routes/diagnosis';
import { authRouter } from './routes/auth';
import { kycRouter } from './routes/kyc';
import { doctorsRouter } from './routes/doctors';
import { doctorFormConfigRouter, formConfigRouter } from './routes/formConfig';

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

// Route de test
app.get('/ping', (req: Request, res: Response) => {
  res.send('PONG ! Le serveur est vivant.');
});

// Routes API
app.use('/api/diagnosis', diagnosisRouter);
app.use('/api/auth', authRouter);
app.use('/api/kyc', kycRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/form-config', formConfigRouter);
app.use('/api/doctor/form-config', doctorFormConfigRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Serveur PRÊT sur http://localhost:${port}`);
    console.log(`👉 Teste moi avec : curl http://localhost:${port}/ping`);
});

export default app
