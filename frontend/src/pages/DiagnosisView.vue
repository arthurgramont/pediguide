<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Field, FieldError } from '@/components/ui/field'
import { useDiagnosisFormStore } from '@/stores/diagnosisForm'
import type { DiagnosisFormState } from '@/stores/diagnosisForm'
import DiagnosisHeader from '@/pages/diagnosis/DiagnosisHeader.vue'
import DiagnosisStep1 from '@/pages/diagnosis/DiagnosisStep1.vue'
import DiagnosisStep2 from '@/pages/diagnosis/DiagnosisStep2.vue'
import DiagnosisStep3 from '@/pages/diagnosis/DiagnosisStep3.vue'
import DiagnosisStep4 from '@/pages/diagnosis/DiagnosisStep4.vue'
import DiagnosisStep5 from '@/pages/diagnosis/DiagnosisStep5.vue'
import {
  errorId,
  fieldIds,
  validators,
  type FormFieldKey,
} from '@/pages/diagnosis/diagnosisValidation'
import { API_BASE_URL } from '@/services/api'
import {
  defaultFormConfig,
  formConfigApi,
  formFieldStepMap,
  type FormConfig,
  type FormConfigField,
} from '@/services/formConfigApi'

const router = useRouter()
const formStore = useDiagnosisFormStore()
const { form } = storeToRefs(formStore)

const totalSteps = 5
const step = ref(1)
const isLoading = ref(false)
const errorMessage = ref('')
const stepAttempted = ref(false)
const configError = ref('')
const isConfigLoading = ref(false)

const formConfig = ref<FormConfig>(defaultFormConfig)

const progress = computed(() => (step.value / totalSteps) * 100)

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const maxBirthDate = computed(() => formatDate(new Date()))

const errors = reactive<Partial<Record<FormFieldKey, string>>>({})
const touched = reactive<Partial<Record<FormFieldKey, boolean>>>({})

const stepHeadingIds: Record<number, string> = {
  1: 'step-1-title',
  2: 'step-2-title',
  3: 'step-3-title',
  4: 'step-4-title',
  5: 'step-5-title',
}

const activeFields = computed(() =>
  formConfig.value.fields.filter((field) => field.isActive !== false),
)

const fieldsByKey = computed(() => {
  return formConfig.value.fields.reduce<Record<string, FormConfigField>>((acc, field) => {
    acc[field.key] = field
    return acc
  }, {})
})

const getFieldsForStep = (stepNumber: number) => {
  return activeFields.value
    .filter((field) => formFieldStepMap[field.key] === stepNumber)
    .sort((a, b) => a.order - b.order)
}

const step1Fields = computed(() => getFieldsForStep(1))
const step2Fields = computed(() => getFieldsForStep(2))
const step3Fields = computed(() => getFieldsForStep(3))
const step4Fields = computed(() => getFieldsForStep(4))
const step5Fields = computed(() => getFieldsForStep(5))
const step5Field = computed(() => step5Fields.value[0] ?? null)

const getFieldConfig = (field: FormFieldKey) => fieldsByKey.value[field]

const isFieldActive = (field: FormFieldKey) => {
  if (field === 'consent') return true
  const config = getFieldConfig(field)
  return config ? config.isActive !== false : true
}

const isFieldRequired = (field: FormFieldKey) => {
  if (field === 'consent') return true
  const config = getFieldConfig(field)
  return config ? Boolean(config.required) : false
}

const isEmptyValue = (field: FormFieldKey, value: DiagnosisFormState[FormFieldKey]) => {
  if (Array.isArray(value)) {
    return value.length === 0
  }
  if (typeof value === 'boolean') {
    return value !== true
  }
  return String(value ?? '').trim().length === 0
}

const requiredMessages: Partial<Record<FormFieldKey, string>> = {
  behaviorChanges: 'Merci de sélectionner au moins une option.',
  clinicalSigns: 'Merci de sélectionner au moins une option.',
  actionsTaken: 'Merci de sélectionner au moins une option.',
  consent: 'Merci de donner votre consentement avant l\'envoi.',
}

const validateField = (field: FormFieldKey) => {
  if (!isFieldActive(field)) {
    delete errors[field]
    return true
  }

  const required = isFieldRequired(field)
  const value = form.value[field]
  const isEmpty = isEmptyValue(field, value)

  if (!required && isEmpty) {
    delete errors[field]
    return true
  }

  const validator = validators[field]
  let error = validator ? validator(value) : null

  if (!error && required && isEmpty) {
    error = requiredMessages[field] || 'Ce champ est requis.'
  }

  if (error) {
    errors[field] = error
    return false
  }

  delete errors[field]
  return true
}

const shouldShowError = (field: FormFieldKey) => Boolean(errors[field])
  && (touched[field] || stepAttempted.value)

const setFieldError = (field: FormFieldKey) => {
  validateField(field)
}

const handleFieldBlur = (field: FormFieldKey) => {
  touched[field] = true
  setFieldError(field)
}

const handleFieldInput = (field: FormFieldKey) => {
  if (touched[field] || stepAttempted.value) {
    setFieldError(field)
  }
}

const handleFieldChange = (field: FormFieldKey) => {
  touched[field] = true
  setFieldError(field)
}

const validateStep = (currentStep: number) => {
  let isValid = true

  const fields = getFieldsForStep(currentStep)
  fields.forEach((field) => {
    if (!validateField(field.key as FormFieldKey)) {
      isValid = false
    }
  })

  if (currentStep === 5 && !validateField('consent')) {
    isValid = false
  }

  return isValid
}

const focusField = async (field: FormFieldKey) => {
  await nextTick()
  const rawId = fieldIds[field] || ''
  const elementId = String(rawId)
  if (!elementId || elementId.trim() === '') return
  const element = document.getElementById(elementId)
  if (element instanceof HTMLElement) {
    element.focus()
    element.scrollIntoView({ block: 'center' })
  }
}

const focusFirstInvalidField = async (currentStep: number) => {
  const fields = getFieldsForStep(currentStep).map((field) => field.key as FormFieldKey)
  if (currentStep === 5) {
    fields.push('consent')
  }

  const firstInvalidField = fields.find((field) => Boolean(errors[field]))
  if (firstInvalidField) {
    await focusField(firstInvalidField)
  }
}

const focusStepHeading = async () => {
  await nextTick()
  const headingId = stepHeadingIds[step.value]
  if (!headingId) return
  const heading = document.getElementById(headingId)
  if (heading instanceof HTMLElement) {
    heading.focus()
  }
}

const nextStep = async () => {
  stepAttempted.value = true
  const isValid = validateStep(step.value)
  if (!isValid) {
    await focusFirstInvalidField(step.value)
    return
  }

  stepAttempted.value = false
  step.value = Math.min(step.value + 1, totalSteps)
}

const prevStep = () => {
  stepAttempted.value = false
  step.value = Math.max(step.value - 1, 1)
}

const validateAllSteps = () => {
  let firstInvalidStep: number | null = null

  for (let i = 1; i <= totalSteps; i += 1) {
    const isValid = validateStep(i)
    if (!isValid && firstInvalidStep === null) {
      firstInvalidStep = i
    }
  }

  return firstInvalidStep
}

const resetValidationState = () => {
  for (const field in errors) {
    delete errors[field as FormFieldKey]
  }
  for (const field in touched) {
    delete touched[field as FormFieldKey]
  }
  stepAttempted.value = false
}

const submitForm = async () => {
  errorMessage.value = ''
  const invalidStep = validateAllSteps()

  if (invalidStep) {
    step.value = invalidStep
    stepAttempted.value = true
    await focusFirstInvalidField(invalidStep)
    return
  }

  isLoading.value = true

  try {
    const res = await fetch(`${API_BASE_URL}/diagnosis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Erreur inconnue')
    }

    formStore.reset()
    resetValidationState()
    const submissionId = String(data.id || '')
    if (!submissionId) {
      throw new Error('Identifiant de soumission manquant')
    }
    await router.push(`/results/${submissionId}`)
  } catch (error) {
    console.error(error)
    errorMessage.value = "Une erreur est survenue lors de l'envoi."
  } finally {
    isLoading.value = false
  }
}

const loadFormConfig = async () => {
  isConfigLoading.value = true
  configError.value = ''
  try {
    formConfig.value = await formConfigApi.get()
    resetValidationState()
  } catch (err: unknown) {
    const errorObj = err as Error
    configError.value = errorObj.message || 'Impossible de charger le formulaire.'
    formConfig.value = defaultFormConfig
  } finally {
    isConfigLoading.value = false
  }
}

watch(step, async () => {
  if (!stepAttempted.value) {
    await focusStepHeading()
  }
})

onMounted(() => {
  void loadFormConfig()
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <div class="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <section class="rounded-2xl border border-border/70 bg-background p-6 shadow-sm">
        <DiagnosisHeader :step="step" :total-steps="totalSteps" :progress="progress" />

        <form novalidate @submit.prevent="submitForm" class="mt-8 space-y-6">
          <div
            v-if="configError"
            class="rounded-xl border border-border/70 bg-muted/30 px-4 py-3 text-sm text-destructive"
            aria-live="polite"
          >
            {{ configError }}
          </div>
          <div
            v-else-if="isConfigLoading"
            class="rounded-xl border border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
            aria-live="polite"
          >
            Chargement du formulaire...
          </div>

          <DiagnosisStep1
            v-if="step === 1"
            :form="form"
            :fields="step1Fields"
            :errors="errors"
            :max-birth-date="maxBirthDate"
            :should-show-error="shouldShowError"
            :error-id="errorId"
            @field-blur="handleFieldBlur"
            @field-input="handleFieldInput"
          />

          <DiagnosisStep2
            v-if="step === 2"
            :form="form"
            :fields="step2Fields"
            :errors="errors"
            :should-show-error="shouldShowError"
            :error-id="errorId"
          />

          <DiagnosisStep3
            v-if="step === 3"
            :form="form"
            :fields="step3Fields"
            :errors="errors"
            :should-show-error="shouldShowError"
            :error-id="errorId"
            @field-change="handleFieldChange"
          />

          <DiagnosisStep4
            v-if="step === 4"
            :form="form"
            :fields="step4Fields"
            :errors="errors"
            :should-show-error="shouldShowError"
            :error-id="errorId"
          />

          <DiagnosisStep5 v-if="step === 5" :form="form" :field="step5Field" />

          <div
            v-if="step === totalSteps"
            class="space-y-3 rounded-xl border border-border/70 bg-background/60 p-4"
          >
            <p class="text-sm font-medium text-foreground">Consentement</p>
            <Field :data-invalid="shouldShowError('consent')" class="gap-2">
              <label
                for="consent-checkbox"
                class="flex items-start gap-3 rounded-lg border border-border/70 bg-background p-3 transition-colors hover:bg-accent/60 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
              >
                <input
                  id="consent-checkbox"
                  v-model="form.consent"
                  type="checkbox"
                  name="consent"
                  required
                  class="mt-0.5 h-4 w-4 rounded border-input accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  :aria-invalid="Boolean(errors.consent)"
                  :aria-describedby="shouldShowError('consent') ? errorId('consent') : undefined"
                  @change="handleFieldChange('consent')"
                />
                <span class="text-sm text-foreground">
                  Je consens à la transmission de ces informations au médecin afin de préparer la consultation.
                  <span class="text-destructive" aria-hidden="true">*</span>
                </span>
              </label>
              <FieldError
                v-if="shouldShowError('consent')"
                :id="errorId('consent')"
                :errors="[errors.consent]"
              />
            </Field>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-6">
            <Button v-if="step > 1" type="button" variant="outline" @click="prevStep">
              Retour
            </Button>
            <span v-else aria-hidden="true"></span>

            <Button
              v-if="step < totalSteps"
              type="button"
              class="pg-btn-continue"
              @click="nextStep"
            >
              Continuer
            </Button>

            <Button
              v-else
              type="submit"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Envoi...' : 'Envoyer mes réponses' }}
            </Button>
          </div>

          <p v-if="errorMessage" class="text-center text-sm text-destructive" role="alert">
            {{ errorMessage }}
          </p>
        </form>

      </section>
    </div>
  </div>
</template>
