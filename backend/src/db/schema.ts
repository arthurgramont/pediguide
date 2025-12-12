import { pgTable, serial, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core';

export const formulaires = pgTable('formulaires', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),
  
  prenomEnfant: text('prenom_enfant').notNull(),
  age: integer('age').notNull(),
  sexe: text('sexe').notNull(),
  
  symptomes: text('symptomes').notNull(),
  douleur: integer('douleur').notNull(),
  
  emailParent: text('email_parent'),
  telephoneParent: text('telephone_parent'),
});