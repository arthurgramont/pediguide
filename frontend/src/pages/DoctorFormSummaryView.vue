<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { doctorFormsApi, type DoctorFormDetail } from '@/services/doctorFormsApi'

const route = useRoute()

const formId = computed(() => String(route.params.id || ''))
const form = ref<DoctorFormDetail | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const loadForm = async () => {
  if (!formId.value) {
    error.value = 'Identifiant de formulaire manquant.'
    isLoading.value = false
    return
  }

  isLoading.value = true
  error.value = null

  try {
    form.value = await doctorFormsApi.get(formId.value)
  } catch (err: unknown) {
    const errorObj = err as Error
    error.value = errorObj.message || 'Impossible de charger le formulaire.'
    form.value = null
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadForm()
})

watch(formId, () => {
  loadForm()
})
</script>

<template>
  <div class="mx-auto flex w-full max-w-4xl flex-col gap-6 py-10">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <div class="space-y-2">
        <h1 id="doctor-form-summary-title" class="text-3xl font-semibold tracking-tight text-foreground">
          Resume du formulaire
        </h1>
        <p class="text-muted-foreground">
          Consultez les informations transmises par le patient.
        </p>
      </div>
      <Button as-child variant="outline">
        <RouterLink to="/dashboard">Retour au dashboard</RouterLink>
      </Button>
    </header>

    <section aria-labelledby="doctor-form-summary-section-title">
      <div v-if="isLoading" class="rounded-2xl border border-border/70 bg-background p-8">
        <p class="text-sm text-muted-foreground" aria-live="polite">Chargement...</p>
      </div>

      <div v-else-if="error" class="rounded-2xl border border-border/70 bg-background p-8">
        <p class="text-sm text-destructive" aria-live="polite">{{ error }}</p>
      </div>

      <Card v-else>
        <CardHeader>
          <CardTitle id="doctor-form-summary-section-title" as="h2">
            Informations generales
          </CardTitle>
          <CardDescription>
            Soumis le {{ form ? formatDate(form.submittedAt) : '' }}
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <section class="space-y-3">
            <h3 class="text-base font-semibold text-foreground">Patient</h3>
            <dl class="grid gap-4 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Prenom</dt>
                <dd class="text-sm text-foreground">
                  {{ form?.patientFirstName || 'Non renseigne' }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Identifiant</dt>
                <dd class="text-sm text-foreground">
                  {{ form?.id || 'Non renseigne' }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-muted-foreground">Date de naissance</dt>
                <dd class="text-sm text-foreground">
                  {{ form?.childBirthDate || 'Non renseigne' }}
                </dd>
              </div>
            </dl>
          </section>

          <section class="space-y-3">
            <h3 class="text-base font-semibold text-foreground">Motif de consultation</h3>
            <p class="text-sm text-foreground">
              {{ form?.consultationReason || 'Non renseigne' }}
            </p>
          </section>

          <section class="grid gap-6 md:grid-cols-2">
            <div class="space-y-3">
              <h3 class="text-base font-semibold text-foreground">Signes cliniques</h3>
              <ul v-if="form?.clinicalSigns?.length" class="list-disc pl-5 text-sm text-foreground">
                <li v-for="item in form?.clinicalSigns" :key="item">{{ item }}</li>
              </ul>
              <p v-else class="text-sm text-muted-foreground">Aucun signe rapporte.</p>
            </div>

            <div class="space-y-3">
              <h3 class="text-base font-semibold text-foreground">Changements observes</h3>
              <ul v-if="form?.behaviorChanges?.length" class="list-disc pl-5 text-sm text-foreground">
                <li v-for="item in form?.behaviorChanges" :key="item">{{ item }}</li>
              </ul>
              <p v-else class="text-sm text-muted-foreground">Aucun changement indique.</p>
            </div>
          </section>

          <section class="grid gap-6 md:grid-cols-2">
            <div class="space-y-3">
              <h3 class="text-base font-semibold text-foreground">Duree</h3>
              <p class="text-sm text-foreground">
                {{ form?.duration || 'Non renseigne' }}
              </p>
            </div>
            <div class="space-y-3">
              <h3 class="text-base font-semibold text-foreground">Niveau de preoccupation</h3>
              <p class="text-sm text-foreground">
                {{ form?.worryLevel || 'Non renseigne' }}
              </p>
            </div>
          </section>

          <section class="space-y-3">
            <h3 class="text-base font-semibold text-foreground">Actions deja prises</h3>
            <ul v-if="form?.actionsTaken?.length" class="list-disc pl-5 text-sm text-foreground">
              <li v-for="item in form?.actionsTaken" :key="item">{{ item }}</li>
            </ul>
            <p v-else class="text-sm text-muted-foreground">Aucune action indiquee.</p>
          </section>

          <section class="space-y-3">
            <h3 class="text-base font-semibold text-foreground">Notes complementaires</h3>
            <p class="text-sm text-foreground">
              {{ form?.additionalNotes || 'Aucune note' }}
            </p>
          </section>
        </CardContent>
      </Card>
    </section>
  </div>
</template>
