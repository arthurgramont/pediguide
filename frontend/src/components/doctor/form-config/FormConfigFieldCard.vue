<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import type { FormConfigField, FormFieldKey } from '@/services/formConfigApi'
import FormConfigOptionsEditor from './FormConfigOptionsEditor.vue'

const props = defineProps<{
  field: FormConfigField
  index: number
  total: number
  errors?: {
    label?: string
    options?: string
  }
}>()

const emit = defineEmits<{
  (e: 'update', payload: { index: number; field: 'label' | 'required' | 'helpText' | 'isActive'; value: string | boolean }): void
  (e: 'move', payload: { index: number; direction: 'up' | 'down' }): void
  (e: 'add-option', index: number): void
  (e: 'remove-option', payload: { fieldIndex: number; optionIndex: number }): void
  (e: 'move-option', payload: { fieldIndex: number; optionIndex: number; direction: 'up' | 'down' }): void
  (e: 'update-option', payload: { fieldIndex: number; optionIndex: number; field: 'label' | 'value'; value: string }): void
}>()

const fieldNumber = computed(() => props.index + 1)
const labelErrorId = computed(() => `field-${props.field.key}-label-error`)
const isChoiceType = computed(() => ['checkbox', 'radio', 'select'].includes(props.field.type))

const formatKey = (key: FormFieldKey) => key
</script>

<template>
  <Card class="border-border/70">
    <CardHeader class="flex flex-col gap-2">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <CardTitle class="text-lg">Champ {{ fieldNumber }}</CardTitle>
          <CardDescription>
            Clé technique : <span class="font-medium text-foreground">{{ formatKey(field.key) }}</span>
          </CardDescription>
        </div>
        <div class="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            :disabled="index === 0"
            :aria-label="`Monter le champ ${fieldNumber}`"
            @click="emit('move', { index, direction: 'up' })"
          >
            Monter
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            :disabled="index === total - 1"
            :aria-label="`Descendre le champ ${fieldNumber}`"
            @click="emit('move', { index, direction: 'down' })"
          >
            Descendre
          </Button>
        </div>
      </div>
    </CardHeader>

    <CardContent class="space-y-5">
      <Field>
        <FieldLabel :for="`field-${field.key}-label`">Libellé affiché</FieldLabel>
        <Input
          :id="`field-${field.key}-label`"
          :model-value="field.label"
          :aria-invalid="Boolean(errors?.label)"
          :aria-describedby="errors?.label ? labelErrorId : undefined"
          type="text"
          placeholder="Libellé visible dans le formulaire"
          @update:model-value="emit('update', { index, field: 'label', value: String($event) })"
        />
        <FieldError v-if="errors?.label" :id="labelErrorId" :errors="[errors.label]" />
      </Field>

      <Field>
        <FieldLabel :for="`field-${field.key}-help`">Texte d'aide (optionnel)</FieldLabel>
        <Input
          :id="`field-${field.key}-help`"
          :model-value="field.helpText ?? ''"
          type="text"
          placeholder="Ex : Plusieurs choix possibles"
          @update:model-value="emit('update', { index, field: 'helpText', value: String($event) })"
        />
      </Field>

      <div class="flex flex-wrap items-center gap-6">
        <div class="flex items-center gap-2">
          <input
            :id="`field-${field.key}-required`"
            type="checkbox"
            class="h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            :checked="field.required"
            @change="emit('update', { index, field: 'required', value: ($event.target as HTMLInputElement).checked })"
          />
          <label :for="`field-${field.key}-required`" class="text-sm font-medium">
            Champ obligatoire
          </label>
        </div>

        <div class="flex items-center gap-2">
          <input
            :id="`field-${field.key}-active`"
            type="checkbox"
            class="h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            :checked="field.isActive"
            @change="emit('update', { index, field: 'isActive', value: ($event.target as HTMLInputElement).checked })"
          />
          <label :for="`field-${field.key}-active`" class="text-sm font-medium">
            Champ actif
          </label>
        </div>

        <div class="text-xs text-muted-foreground">
          Type : {{ field.type }}
        </div>
      </div>

      <FormConfigOptionsEditor
        v-if="isChoiceType"
        :options="field.options || []"
        :field-key="field.key"
        :error-message="errors?.options"
        @add="emit('add-option', index)"
        @remove="(optionIndex) => emit('remove-option', { fieldIndex: index, optionIndex })"
        @move="({ optionIndex, direction }) => emit('move-option', { fieldIndex: index, optionIndex, direction })"
        @update="({ optionIndex, field, value }) => emit('update-option', { fieldIndex: index, optionIndex, field, value })"
      />
    </CardContent>
  </Card>
</template>
