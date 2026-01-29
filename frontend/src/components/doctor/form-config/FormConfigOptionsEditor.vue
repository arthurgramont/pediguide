<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { FormFieldOption, FormFieldKey } from '@/services/formConfigApi'

const props = defineProps<{
  options: FormFieldOption[]
  fieldKey: FormFieldKey
  errorMessage?: string
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'remove', optionIndex: number): void
  (e: 'move', payload: { optionIndex: number; direction: 'up' | 'down' }): void
  (e: 'update', payload: { optionIndex: number; field: 'label' | 'value'; value: string }): void
}>()

const headingId = computed(() => `field-${props.fieldKey}-options-heading`)
const errorId = computed(() => `field-${props.fieldKey}-options-error`)

const handleUpdate = (optionIndex: number, field: 'label' | 'value', value: string) => {
  emit('update', { optionIndex, field, value })
}
</script>

<template>
  <div class="space-y-3 rounded-lg border border-border/70 bg-muted/30 p-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h4 :id="headingId" class="text-sm font-semibold text-foreground">Options de réponse</h4>
      <Button type="button" variant="outline" size="sm" @click="emit('add')">
        Ajouter une option
      </Button>
    </div>

    <FieldError v-if="errorMessage" :id="errorId" class="text-sm" :errors="[errorMessage]" />

    <div
      v-for="(option, optionIndex) in options"
      :key="`${fieldKey}-${optionIndex}`"
      class="rounded-md border border-border/70 bg-background p-3"
    >
      <div class="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
        <Field>
          <FieldLabel :for="`field-${fieldKey}-option-${optionIndex}-label`">
            Libellé de l'option
          </FieldLabel>
          <Input
            :id="`field-${fieldKey}-option-${optionIndex}-label`"
            :model-value="option.label"
            type="text"
            :aria-describedby="errorMessage ? errorId : undefined"
            @update:model-value="handleUpdate(optionIndex, 'label', String($event))"
          />
        </Field>

        <Field>
          <FieldLabel :for="`field-${fieldKey}-option-${optionIndex}-value`">
            Valeur (optionnel)
          </FieldLabel>
          <Input
            :id="`field-${fieldKey}-option-${optionIndex}-value`"
            :model-value="option.value"
            type="text"
            :aria-describedby="errorMessage ? errorId : undefined"
            @update:model-value="handleUpdate(optionIndex, 'value', String($event))"
          />
        </Field>

        <div class="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            :disabled="optionIndex === 0"
            :aria-label="`Monter l'option ${optionIndex + 1}`"
            @click="emit('move', { optionIndex, direction: 'up' })"
          >
            Monter
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            :disabled="optionIndex === options.length - 1"
            :aria-label="`Descendre l'option ${optionIndex + 1}`"
            @click="emit('move', { optionIndex, direction: 'down' })"
          >
            Descendre
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            :aria-label="`Supprimer l'option ${optionIndex + 1}`"
            @click="emit('remove', optionIndex)"
          >
            Supprimer
          </Button>
        </div>
      </div>
    </div>

    <p v-if="options.length === 0" class="text-sm text-muted-foreground" aria-live="polite">
      Ajoutez au moins une option pour cette question.
    </p>
  </div>
</template>
