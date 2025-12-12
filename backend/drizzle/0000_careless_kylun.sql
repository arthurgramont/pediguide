CREATE TABLE "formulaires" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"prenom_enfant" text NOT NULL,
	"age" integer NOT NULL,
	"sexe" text NOT NULL,
	"symptomes" text NOT NULL,
	"douleur" integer NOT NULL,
	"email_parent" text,
	"telephone_parent" text
);
