<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import FormConfigFieldCard from '@/components/doctor/form-config/FormConfigFieldCard.vue'
import {
  defaultFormConfig,
  formConfigApi,
  formFieldStepMap,
  type FormConfig,
  type FormConfigField,
  type FormFieldKey,
} from '@/services/formConfigApi'

const configState = ref<FormConfig>(defaultFormConfig)
const isLoading = ref(false)
const isSaving = ref(false)
const apiError = ref<string | null>(null)
const statusMessage = ref('')
const liveMessage = ref('')
const hasSubmitted = ref(false)

const stepSections = [
  {
    id: 1,
    title: 'Informations patient',
    description: "Champs d'identité et motif de consultation.",
  },
  {
    id: 2,
    title: 'Observations',
    description: 'Listes à choix multiples sur le comportement et les signes cliniques.',
  },
  {
    id: 3,
    title: 'Durée et ressenti',
    description: "Questions obligatoires pour préparer la consultation.",
  },
  {
    id: 4,
    title: 'Actions réalisées',
    description: "Actions déjà effectuées par le parent.",
  },
  {
    id: 5,
    title: 'Message libre',
    description: 'Zone de commentaire libre du patient.',
  },
]

const fieldsByStep = computed<Record<number, FormConfigField[]>>(() => {
  const map: Record<number, FormConfigField[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] }
  configState.value.fields.forEach((field) => {
    const step = formFieldStepMap[field.key]
    if (step) {
      map[step].push(field)
    }
  })
  Object.keys(map).forEach((key) => {
    map[Number(key)].sort((a, b) => a.order - b.order)
  })
  return map
})

const validationErrors = computed(() => {
  const errors: Record<FormFieldKey, { label?: string; options?: string }> = {}
  let isValid = true

  configState.value.fields.forEach((field) => {
    const fieldErrors: { label?: string; options?: string } = {}
    if (!field.label.trim()) {
      fieldErrors.label = 'Le libellé est obligatoire.'
      isValid = false
    }

    if (['checkbox', 'radio', 'select'].includes(field.type)) {
      const options = field.options || []
      const hasValidOption = options.some((option) => option.label.trim())
      if (field.isActive && !hasValidOption) {
        fieldErrors.options = 'Ajoutez au moins une option de réponse.'
        isValid = false
      }
    }

    if (fieldErrors.label || fieldErrors.options) {
      errors[field.key] = fieldErrors
    }
  })

  return { isValid, errors }
})

const canSave = computed(() => validationErrors.value.isValid && !isSaving.value && !isLoading.value)

const errorSummary = computed(() => {
  if (!hasSubmitted.value || validationErrors.value.isValid) return ''
  return "Certains champs doivent être corrigés avant l'enregistrement."
})

const updateFieldByKey = (key: FormFieldKey, updates: Partial<FormConfigField>) => {
  const field = configState.value.fields.find((item) => item.key === key)
  if (!field) return
  Object.assign(field, updates)
}

const syncOrderForStep = (stepId: number) => {
  const fields = fieldsByStep.value[stepId] || []
  fields.forEach((field, index) => {
    updateFieldByKey(field.key, { order: index + 1 })
  })
}

const moveField = (stepId: number, index: number, direction: 'up' | 'down') => {
  const fields = fieldsByStep.value[stepId]
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (!fields || targetIndex < 0 || targetIndex >= fields.length) return

  const currentField = fields[index]
  const targetField = fields[targetIndex]
  if (!currentField || !targetField) return

  const tempOrder = currentField.order
  updateFieldByKey(currentField.key, { order: targetField.order })
  updateFieldByKey(targetField.key, { order: tempOrder })
  syncOrderForStep(stepId)

  liveMessage.value = `Champ déplacé vers le ${direction === 'up' ? 'haut' : 'bas'}.`
}

const addOption = (stepId: number, fieldIndex: number) => {
  const field = fieldsByStep.value[stepId]?.[fieldIndex]
  if (!field) return
  if (!field.options) field.options = []

  const nextNumber = field.options.length + 1
  field.options.push({
    label: `Option ${nextNumber}`,
    value: `Option ${nextNumber}`,
  })
  liveMessage.value = `Option ajoutée pour ${field.label}.`
}

const removeOption = (stepId: number, fieldIndex: number, optionIndex: number) => {
  const field = fieldsByStep.value[stepId]?.[fieldIndex]
  if (!field || !field.options) return
  field.options.splice(optionIndex, 1)
  liveMessage.value = `Option supprimée pour ${field.label}.`
}

const moveOption = (stepId: number, fieldIndex: number, optionIndex: number, direction: 'up' | 'down') => {
  const field = fieldsByStep.value[stepId]?.[fieldIndex]
  if (!field || !field.options) return
  const targetIndex = direction === 'up' ? optionIndex - 1 : optionIndex + 1
  if (targetIndex < 0 || targetIndex >= field.options.length) return

  ;[field.options[optionIndex], field.options[targetIndex]] = [
    field.options[targetIndex],
    field.options[optionIndex],
  ]
  liveMessage.value = `Option déplacée pour ${field.label}.`
}

const updateOption = (
  stepId: number,
  fieldIndex: number,
  optionIndex: number,
  optionField: 'label' | 'value',
  value: string,
) => {
  const field = fieldsByStep.value[stepId]?.[fieldIndex]
  if (!field || !field.options) return
  const option = field.options[optionIndex]
  if (!option) return

  option[optionField] = value
}

const buildPayload = (): FormConfig => {
  return {
    version: 1,
    fields: configState.value.fields.map((field) => ({
      ...field,
      label: field.label.trim(),
      helpText: field.helpText?.trim() || null,
      options: ['checkbox', 'radio', 'select'].includes(field.type)
        ? (field.options || [])
            .map((option) => ({
              label: option.label.trim(),
              value: option.value.trim() || option.label.trim(),
            }))
            .filter((option) => option.label)
        : [],
    })),
  }
}

const loadConfig = async () => {
  isLoading.value = true
  apiError.value = null

  try {
    const config = await formConfigApi.getDoctor()
    configState.value = config
    stepSections.forEach((section) => syncOrderForStep(section.id))
  } catch (err: unknown) {
    const errorObj = err as Error
    apiError.value = errorObj.message || 'Impossible de charger la configuration.'
  } finally {
    isLoading.value = false
  }
}

const handleSave = async () => {
  hasSubmitted.value = true
  statusMessage.value = ''
  apiError.value = null

  if (!validationErrors.value.isValid) {
    statusMessage.value = 'Veuillez corriger les erreurs avant de sauvegarder.'
    return
  }

  isSaving.value = true

  try {
    const payload = buildPayload()
    const updated = await formConfigApi.updateDoctor(payload)
    configState.value = updated
    stepSections.forEach((section) => syncOrderForStep(section.id))
    statusMessage.value = 'Formulaire mis à jour avec succès.'
  } catch (err: unknown) {
    const errorObj = err as Error
    apiError.value = errorObj.message || 'Impossible de sauvegarder la configuration.'
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  void loadConfig()
})
</script>

<template>
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-6 py-10">
    <p class="sr-only" aria-live="polite">{{ liveMessage }}</p>

    <header class="space-y-2">
      <h1 class="text-3xl font-semibold tracking-tight text-foreground">
        Éditer le formulaire patient
      </h1>
      <p class="text-muted-foreground">
        Ajustez les libellés, l'ordre et les options visibles pour les patients.
      </p>
    </header>

    <section aria-labelledby="form-editor-section" class="space-y-6">
      <Card>
        <CardHeader class="space-y-3">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle id="form-editor-section" as="h2" class="text-xl">
                Configuration active
              </CardTitle>
              <CardDescription>
                Une seule configuration est active et utilisée par le formulaire patient.
              </CardDescription>
            </div>
            <div class="flex flex-wrap gap-2">
              <Button type="button" class="pg-btn-continue" :disabled="!canSave" @click="handleSave">
                {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
              </Button>
            </div>
          </div>

          <div v-if="errorSummary" class="rounded-lg border border-border/70 bg-muted/30 px-4 py-3" aria-live="polite">
            <p class="text-sm text-destructive">{{ errorSummary }}</p>
          </div>

          <div v-if="statusMessage" class="rounded-lg border border-border/70 bg-muted/30 px-4 py-3" aria-live="polite">
            <p class="text-sm text-foreground">{{ statusMessage }}</p>
          </div>

          <div v-if="apiError" class="rounded-lg border border-border/70 bg-muted/30 px-4 py-3" aria-live="polite">
            <p class="text-sm text-destructive">{{ apiError }}</p>
          </div>
        </CardHeader>
        <CardContent class="space-y-6">
          <div v-if="isLoading" class="rounded-lg border border-border/70 bg-muted/30 px-6 py-8 text-center">
            <p class="text-sm text-muted-foreground" aria-live="polite">Chargement de la configuration...</p>
          </div>

          <template v-else>
            <div v-for="section in stepSections" :key="section.id" class="space-y-4">
              <div class="space-y-1">
                <h3 class="text-lg font-semibold text-foreground">{{ section.title }}</h3>
                <p class="text-sm text-muted-foreground">{{ section.description }}</p>
              </div>

              <div v-if="fieldsByStep[section.id]?.length === 0" class="rounded-lg border border-border/70 bg-muted/30 px-6 py-8 text-center">
                <p class="text-sm text-muted-foreground" aria-live="polite">
                  Aucun champ actif dans cette section.
                </p>
              </div>

              <FormConfigFieldCard
                v-for="(field, index) in fieldsByStep[section.id]"
                :key="field.key"
                :field="field"
                :index="index"
                :total="fieldsByStep[section.id].length"
                :errors="hasSubmitted ? validationErrors.errors[field.key] : {}"
                @update="({ index: fieldIndex, field: updateField, value }) => updateFieldByKey(fieldsByStep[section.id][fieldIndex].key, { [updateField]: value })"
                @move="({ index: fieldIndex, direction }) => moveField(section.id, fieldIndex, direction)"
                @add-option="(fieldIndex) => addOption(section.id, fieldIndex)"
                @remove-option="({ fieldIndex, optionIndex }) => removeOption(section.id, fieldIndex, optionIndex)"
                @move-option="({ fieldIndex, optionIndex, direction }) => moveOption(section.id, fieldIndex, optionIndex, direction)"
                @update-option="({ fieldIndex, optionIndex, field: optionField, value }) => updateOption(section.id, fieldIndex, optionIndex, optionField, value)"
              />
            </div>
          </template>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
