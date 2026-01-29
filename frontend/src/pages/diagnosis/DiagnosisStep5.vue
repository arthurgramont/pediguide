<script setup lang="ts">
import type { DiagnosisFormState } from '@/stores/diagnosisForm'
import type { FormConfigField } from '@/services/formConfigApi'
import { Field, FieldLabel } from '@/components/ui/field'
import type { FormFieldKey } from '@/pages/diagnosis/diagnosisValidation'
import { fieldIds } from '@/pages/diagnosis/diagnosisValidation'

defineProps<{
  form: DiagnosisFormState
  field: FormConfigField | null
}>()

const resolveFieldId = (key: FormFieldKey) => fieldIds[key] || key
</script>

<template>
  <section class="space-y-6" aria-labelledby="step-5-title">
    <div class="space-y-2">
      <h2 id="step-5-title" tabindex="-1" class="text-h3 font-semibold text-foreground">
        Message libre
      </h2>
      <p class="text-sm text-muted-foreground">
        Vous pouvez ajouter toute précision utile pour le médecin.
      </p>
    </div>

    <Field v-if="field">
      <FieldLabel :for="resolveFieldId(field.key as FormFieldKey)">
        {{ field.label }}
        <span v-if="!field.required" class="text-xs text-muted-foreground">(facultatif)</span>
        <template v-else>
          <span class="text-destructive" aria-hidden="true">*</span>
          <span class="text-xs text-muted-foreground">(obligatoire)</span>
        </template>
      </FieldLabel>
      <textarea
        :id="resolveFieldId(field.key as FormFieldKey)"
        v-model="form[field.key as FormFieldKey]"
        :name="field.key"
        rows="5"
        :required="field.required"
        class="min-h-[140px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        placeholder="Vous pouvez partager ici tout ce qui vous semble important."
      ></textarea>
    </Field>
  </section>
</template>
