CREATE TABLE "form_config" (
  "id" text PRIMARY KEY DEFAULT 'default' NOT NULL,
  "updated_at" timestamp DEFAULT now(),
  "config" jsonb NOT NULL
);
--> statement-breakpoint
INSERT INTO "form_config" ("id", "config")
VALUES (
  'default',
  $$
  {
    "version": 1,
    "fields": [
      {
        "key": "childFirstName",
        "label": "Prénom de l'enfant",
        "type": "text",
        "required": true,
        "order": 1,
        "isActive": true
      },
      {
        "key": "childLastName",
        "label": "Nom de l'enfant",
        "type": "text",
        "required": true,
        "order": 2,
        "isActive": true
      },
      {
        "key": "childBirthDate",
        "label": "Date de naissance",
        "type": "date",
        "required": true,
        "order": 3,
        "isActive": true
      },
      {
        "key": "consultationReason",
        "label": "Motif de consultation",
        "type": "textarea",
        "required": true,
        "order": 4,
        "isActive": true
      },
      {
        "key": "behaviorChanges",
        "label": "Changements de comportement",
        "type": "checkbox",
        "required": false,
        "order": 1,
        "isActive": true,
        "helpText": "Plusieurs choix possibles.",
        "options": [
          { "label": "Il mange moins que d'habitude", "value": "Il mange moins que d'habitude" },
          { "label": "Il dort moins ou plus que d'habitude", "value": "Il dort moins ou plus que d'habitude" },
          { "label": "Il est plus fatigué", "value": "Il est plus fatigué" }
        ]
      },
      {
        "key": "clinicalSigns",
        "label": "Signes cliniques observés",
        "type": "checkbox",
        "required": false,
        "order": 2,
        "isActive": true,
        "helpText": "Plusieurs choix possibles.",
        "options": [
          { "label": "Fièvre", "value": "Fièvre" },
          { "label": "Toux", "value": "Toux" },
          { "label": "Vomissements", "value": "Vomissements" }
        ]
      },
      {
        "key": "duration",
        "label": "Depuis quand ?",
        "type": "radio",
        "required": true,
        "order": 1,
        "isActive": true,
        "options": [
          { "label": "Aujourd'hui", "value": "Aujourd'hui" },
          { "label": "Depuis 1 à 2 jours", "value": "Depuis 1 à 2 jours" },
          { "label": "Depuis plusieurs jours", "value": "Depuis plusieurs jours" },
          { "label": "Depuis plus d'une semaine", "value": "Depuis plus d'une semaine" }
        ]
      },
      {
        "key": "worryLevel",
        "label": "Niveau d'inquiétude",
        "type": "radio",
        "required": true,
        "order": 2,
        "isActive": true,
        "options": [
          { "label": "Peu inquiétant", "value": "Peu inquiétant" },
          { "label": "Moyennement inquiétant", "value": "Moyennement inquiétant" },
          { "label": "Très inquiétant", "value": "Très inquiétant" }
        ]
      },
      {
        "key": "actionsTaken",
        "label": "Actions déjà réalisées",
        "type": "checkbox",
        "required": false,
        "order": 1,
        "isActive": true,
        "helpText": "Plusieurs choix possibles.",
        "options": [
          { "label": "J'ai pris la température", "value": "J'ai pris la température" },
          { "label": "J'ai donné un médicament", "value": "J'ai donné un médicament" },
          { "label": "Je n'ai rien fait pour le moment", "value": "Je n'ai rien fait pour le moment" }
        ]
      },
      {
        "key": "additionalNotes",
        "label": "Message complémentaire",
        "type": "textarea",
        "required": false,
        "order": 1,
        "isActive": true
      }
    ]
  }
  $$::jsonb
)
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
ALTER TABLE "formulaires" DROP CONSTRAINT IF EXISTS "formulaires_template_id_form_templates_id_fk";
--> statement-breakpoint
ALTER TABLE "formulaires" DROP COLUMN IF EXISTS "template_id";
--> statement-breakpoint
DROP TABLE IF EXISTS "form_question_options";
--> statement-breakpoint
DROP TABLE IF EXISTS "form_questions";
--> statement-breakpoint
DROP TABLE IF EXISTS "form_templates";
