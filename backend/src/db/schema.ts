import {
  pgTable,
  uuid,
  text,
  timestamp,
  json,
  jsonb,
  varchar,
  boolean,
  index,
} from 'drizzle-orm/pg-core';

export const doctors = pgTable('doctors', {
  id: uuid('id').defaultRandom().primaryKey(),
  createdAt: timestamp('created_at').defaultNow(),

  rpps: text('rpps').unique().notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),

  cpsCardUrl: text('cps_card_url'),

  accountStatus: text('account_status').default('pending_validation'),

  // KYC/Identity verification fields (Didit integration)
  kycStatus: varchar('kyc_status', { length: 50 }).default('pending'), // 'verified', 'rejected', 'pending'
  kycSessionId: varchar('kyc_session_id', { length: 255 }),
  kycData: jsonb('kyc_data'), // Store additional verification details from webhooks
});

export const formConfig = pgTable('form_config', {
  id: text('id').primaryKey().default('default'),
  updatedAt: timestamp('updated_at').defaultNow(),
  config: jsonb('config').notNull(),
});

export const diagnosis = pgTable(
  'formulaires',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    createdAt: timestamp('created_at').defaultNow(),

    childFirstName: text('child_first_name').notNull(),
    childLastName: text('child_last_name').notNull(),
    childBirthDate: text('child_birth_date').notNull(),
    consultationReason: text('consultation_reason').notNull(),

    behaviorChanges: json('behavior_changes').$type<string[]>(),
    clinicalSigns: json('clinical_signs').$type<string[]>(),

    duration: text('duration').notNull(),
    worryLevel: text('worry_level').notNull(),

    actionsTaken: json('actions_taken').$type<string[]>(),

    additionalNotes: text('additional_notes'),

    status: text('status').default('new'),
    doctorId: uuid('doctor_id').references(() => doctors.id, { onDelete: 'set null' }),
  },
  (table) => ({
    doctorStatusIdx: index('formulaires_doctor_status_idx').on(table.doctorId, table.status),
  }),
);
