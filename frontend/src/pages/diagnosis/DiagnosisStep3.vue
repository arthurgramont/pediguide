<script setup lang="ts">
import type { DiagnosisFormState } from '@/stores/diagnosisForm'
import type { FormFieldKey } from '@/pages/diagnosis/diagnosisValidation'
import { fieldIds } from '@/pages/diagnosis/diagnosisValidation'
import { FieldError, FieldLegend, FieldSet } from '@/components/ui/field'
import type { FormConfigField } from '@/services/formConfigApi'

defineProps<{
  form: DiagnosisFormState
  fields: FormConfigField[]
  errors: Partial<Record<FormFieldKey, string>>
  shouldShowError: (field: FormFieldKey) => boolean
  errorId: (field: FormFieldKey) => string
}>()

const emit = defineEmits<{
  (e: 'field-change', field: FormFieldKey): void
}>()

const resolveFieldId = (key: FormFieldKey, index: number) => {
  const base = fieldIds[key] || key
  return index === 0 ? base : `${base}-${index}`
}
</script>

<template>
  <section class="space-y-6" aria-labelledby="step-3-title">
    <div class="space-y-2">
      <h2 id="step-3-title" tabindex="-1" class="text-h3 font-semibold text-foreground">
        Depuis quand et ressenti
      </h2>
      <p class="text-sm text-muted-foreground">
        Ces informations sont nécessaires pour préparer la consultation.
      </p>
    </div>

    <FieldSet
      v-for="field in fields"
      :key="field.key"
      :aria-invalid="shouldShowError(field.key as FormFieldKey)"
      :aria-describedby="shouldShowError(field.key as FormFieldKey) ? errorId(field.key as FormFieldKey) : undefined"
    >
      <FieldLegend>
        {{ field.label }}
        <template v-if="field.required">
          <span class="text-destructive" aria-hidden="true">*</span>
          <span class="text-xs text-muted-foreground">(obligatoire)</span>
        </template>
        <span v-else class="text-xs text-muted-foreground">(facultatif)</span>
      </FieldLegend>

      <div v-if="field.type === 'select'" class="mt-2">
        <select
          :id="resolveFieldId(field.key as FormFieldKey, 0)"
          v-model="form[field.key as FormFieldKey]"
          :name="String(field.key)"
          :required="field.required"
          class="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          @change="emit('field-change', field.key as FormFieldKey)"
        >
          <option value="" disabled>Choisir une option</option>
          <option
            v-for="(option, optionIndex) in field.options || []"
            :key="`${field.key}-${optionIndex}`"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>

      <div v-else class="space-y-3">
        <label
          v-for="(option, optionIndex) in field.options || []"
          :key="`${field.key}-${optionIndex}`"
          :for="resolveFieldId(field.key as FormFieldKey, optionIndex)"
          class="flex items-start gap-3 rounded-lg border border-border/70 bg-background p-3 transition-colors hover:bg-accent/60 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
        >
          <input
            :id="resolveFieldId(field.key as FormFieldKey, optionIndex)"
            v-model="form[field.key as FormFieldKey]"
            type="radio"
            :name="String(field.key)"
            :value="option.value"
            :required="field.required"
            class="mt-0.5 h-4 w-4 border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            @change="emit('field-change', field.key as FormFieldKey)"
          />
          <span class="text-sm text-foreground">{{ option.label }}</span>
        </label>
      </div>
      <FieldError
        v-if="shouldShowError(field.key as FormFieldKey)"
        :id="errorId(field.key as FormFieldKey)"
        :errors="[errors[field.key as FormFieldKey]]"
      />
    </FieldSet>
  </section>
</template>
