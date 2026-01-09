import { pgTable, uuid, text, date, timestamp, json, integer } from 'drizzle-orm/pg-core';

// --- TABLE 1 : FORMULAIRES PARENTS ---
export const diagnosis = pgTable('formulaires', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  
  // Étape 1 : L'enfant
  childFirstName: text('child_first_name').notNull(),
  childBirthDate: text('child_birth_date').notNull(), // Format "YYYY-MM-DD"
  consultationReason: text('consultation_reason').notNull(),

  // Étape 2 : Observations (Listes de cases à cocher)
  // On utilise JSON pour stocker les tableaux de réponses (ex: ["Fièvre", "Toux"])
  behaviorChanges: json('behavior_changes').$type<string[]>(), 
  clinicalSigns: json('clinical_signs').$type<string[]>(),     

  // Étape 3 : Durée et Ressenti
  duration: text('duration').notNull(), // Ex: "Depuis 1 à 2 jours"
  worryLevel: text('worry_level').notNull(), // Ex: "Très inquiétant"

  // Étape 4 : Actions entreprises
  actionsTaken: json('actions_taken').$type<string[]>(), 

  // Étape 5 : Message libre
  additionalNotes: text('additional_notes'),

  // Statut pour le médecin (Lu / Non lu)
  status: text('status').default('new'), 
});

// --- TABLE 2 : MÉDECINS ---
export const doctors = pgTable('doctors', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),

  // Champs du formulaire d'inscription
  rpps: text('rpps').unique().notNull(), // Numéro RPPS unique
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(), // On stockera le mot de passe hashé
  
  // Pour la carte CPS (Fichier uploadé)
  // On stocke l'URL du fichier ici (ex: lien Supabase Storage ou chemin local)
  cpsCardUrl: text('cps_card_url'), 
  
  // Statut du compte (ex: en attente de validation de la carte CPS)
  accountStatus: text('account_status').default('pending_validation'),
});