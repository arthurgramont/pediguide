<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { DoctorFormSummary, DoctorFormStatus } from '@/services/doctorFormsApi'

const props = withDefaults(
  defineProps<{
    forms: DoctorFormSummary[]
    isLoading?: boolean
    error?: string | null
  }>(),
  {
    isLoading: false,
    error: null,
  },
)

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()

const isEmpty = computed(
  () => !props.isLoading && !props.error && props.forms.length === 0,
)

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const statusLabel: Record<DoctorFormStatus, string> = {
  new: 'Nouveau',
  in_review: 'En cours',
  completed: 'Traite',
}

const statusClasses: Record<DoctorFormStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  in_review: 'bg-amber-100 text-amber-800',
  completed: 'bg-emerald-100 text-emerald-800',
}

const handleRowSelect = (id: string) => {
  emit('select', id)
}

const handleRowKeydown = (event: KeyboardEvent, id: string) => {
  const target = event.target
  if (target instanceof HTMLElement) {
    const isInteractive = target.closest('a, button, input, select, textarea')
    if (isInteractive) return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    emit('select', id)
  }
}
</script>

<template>
  <div class="rounded-2xl border border-border/70 bg-background shadow-sm">
    <div v-if="isLoading" class="px-6 py-10 text-center" aria-live="polite">
      <p class="text-sm text-muted-foreground">Chargement des formulaires...</p>
    </div>

    <div v-else-if="error" class="px-6 py-10 text-center" aria-live="polite">
      <p class="text-sm text-destructive">{{ error }}</p>
    </div>

    <div v-else-if="isEmpty" class="px-6 py-10 text-center">
      <p class="text-sm text-muted-foreground">
        Aucun formulaire ne correspond a votre recherche.
      </p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <caption class="sr-only">Liste des formulaires patients</caption>
        <thead class="border-b border-border/70 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th scope="col" class="px-6 py-3">Patient</th>
            <th scope="col" class="px-6 py-3">Identifiant</th>
            <th scope="col" class="px-6 py-3">Motif</th>
            <th scope="col" class="px-6 py-3">Soumis le</th>
            <th scope="col" class="px-6 py-3">Statut</th>
            <th scope="col" class="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/70">
          <tr
            v-for="form in forms"
            :key="form.id"
            role="link"
            tabindex="0"
            :aria-label="`Ouvrir le formulaire de ${form.patientFirstName} ${form.patientLastName}`"
            class="group cursor-pointer transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            @click="handleRowSelect(form.id)"
            @keydown="handleRowKeydown($event, form.id)"
          >
            <td class="px-6 py-4 font-medium text-foreground">
              {{ form.patientFirstName }} {{ form.patientLastName }}
            </td>
            <td class="px-6 py-4 text-muted-foreground">{{ form.patientIdentifier }}</td>
            <td class="px-6 py-4 text-muted-foreground">{{ form.consultationReason }}</td>
            <td class="px-6 py-4 text-muted-foreground">{{ formatDate(form.submittedAt) }}</td>
            <td class="px-6 py-4">
              <span
                class="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold"
                :class="statusClasses[form.status]"
              >
                {{ statusLabel[form.status] }}
              </span>
            </td>
            <td class="px-6 py-4 text-right">
              <RouterLink
                :to="`/dashboard/${form.id}`"
                class="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                @click.stop
              >
                Voir
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
