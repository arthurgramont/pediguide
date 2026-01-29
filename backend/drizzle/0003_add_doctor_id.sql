ALTER TABLE "formulaires" ADD COLUMN "doctor_id" uuid;
--> statement-breakpoint
ALTER TABLE "formulaires" ADD CONSTRAINT "formulaires_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
--> statement-breakpoint
CREATE INDEX "formulaires_doctor_status_idx" ON "formulaires" USING btree ("doctor_id","status");
