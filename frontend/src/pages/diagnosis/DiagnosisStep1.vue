<script setup lang="ts">
import type { DiagnosisFormState } from '@/stores/diagnosisForm'
import type { FormFieldKey } from '@/pages/diagnosis/diagnosisValidation'
import { fieldIds } from '@/pages/diagnosis/diagnosisValidation'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { FormConfigField } from '@/services/formConfigApi'

defineProps<{
  form: DiagnosisFormState
  fields: FormConfigField[]
  errors: Partial<Record<FormFieldKey, string>>
  shouldShowError: (field: FormFieldKey) => boolean
  errorId: (field: FormFieldKey) => string
  maxBirthDate: string
}>()

const emit = defineEmits<{
  (e: 'field-blur', field: FormFieldKey): void
  (e: 'field-input', field: FormFieldKey): void
}>()

const resolveFieldId = (key: FormFieldKey) => fieldIds[key] || key

const resolvePlaceholder = (key: FormFieldKey) => {
  switch (key) {
    case 'childFirstName':
      return 'Ex : Arthur'
    case 'childLastName':
      return 'Ex : Dupont'
    case 'consultationReason':
      return 'Ex : Fièvre depuis 2 jours, toux et fatigue.'
    default:
      return ''
  }
}

const resolveAutocomplete = (key: FormFieldKey) => {
  switch (key) {
    case 'childFirstName':
      return 'given-name'
    case 'childLastName':
      return 'family-name'
    case 'childBirthDate':
      return 'bday'
    default:
      return 'off'
  }
}
</script>

<template>
  <section class="space-y-6" aria-labelledby="step-1-title">
    <div class="space-y-2">
      <h2 id="step-1-title" tabindex="-1" class="text-h3 font-semibold text-foreground">
        Préparer la consultation de votre enfant
      </h2>
      <p class="text-sm text-muted-foreground">
        Remplissez les informations essentielles sur votre enfant.
      </p>
    </div>

    <FieldGroup>
      <Field
        v-for="field in fields"
        :key="field.key"
        :data-invalid="shouldShowError(field.key as FormFieldKey)"
      >
        <FieldLabel :for="resolveFieldId(field.key as FormFieldKey)">
          {{ field.label }}
          <template v-if="field.required">
            <span class="text-destructive" aria-hidden="true">*</span>
            <span class="text-xs text-muted-foreground">(obligatoire)</span>
          </template>
        </FieldLabel>

        <Input
          v-if="field.type !== 'textarea'"
          :id="resolveFieldId(field.key as FormFieldKey)"
          v-model="form[field.key as FormFieldKey]"
          :type="field.type === 'date' ? 'date' : 'text'"
          :name="field.key"
          :autocomplete="resolveAutocomplete(field.key as FormFieldKey)"
          :required="field.required"
          :max="field.key === 'childBirthDate' ? maxBirthDate : undefined"
          :aria-invalid="Boolean(errors[field.key as FormFieldKey])"
          :aria-describedby="shouldShowError(field.key as FormFieldKey) ? errorId(field.key as FormFieldKey) : undefined"
          :placeholder="resolvePlaceholder(field.key as FormFieldKey)"
          @blur="emit('field-blur', field.key as FormFieldKey)"
          @input="emit('field-input', field.key as FormFieldKey)"
        />

        <textarea
          v-else
          :id="resolveFieldId(field.key as FormFieldKey)"
          v-model="form[field.key as FormFieldKey]"
          :name="field.key"
          rows="4"
          :required="field.required"
          class="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20"
          :aria-invalid="Boolean(errors[field.key as FormFieldKey])"
          :aria-describedby="shouldShowError(field.key as FormFieldKey) ? errorId(field.key as FormFieldKey) : undefined"
          :placeholder="resolvePlaceholder(field.key as FormFieldKey)"
          @blur="emit('field-blur', field.key as FormFieldKey)"
          @input="emit('field-input', field.key as FormFieldKey)"
        ></textarea>

        <FieldError
          v-if="shouldShowError(field.key as FormFieldKey)"
          :id="errorId(field.key as FormFieldKey)"
          :errors="[errors[field.key as FormFieldKey]]"
        />
      </Field>
    </FieldGroup>
  </section>
</template>
