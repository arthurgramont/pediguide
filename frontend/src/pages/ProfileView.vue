<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils.ts'
import type { HTMLAttributes } from 'vue'
import KycVerification from '@/components/KycVerification.vue'
import api, { isAuthenticated } from '@/services/api'

const router = useRouter()

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

interface DoctorProfile {
  id: string
  email: string
  rpps: string
  kycStatus: 'verified' | 'rejected' | 'pending'
  accountStatus: string
  createdAt: string
}

const profile = ref<DoctorProfile | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

/**
 * Fetch profile data from API
 */
async function fetchProfile(silent = false) {
  // Check if user is authenticated
  if (!isAuthenticated()) {
    router.push('/login')
    return
  }

  try {
    if (!silent || !profile.value) {
      isLoading.value = true
    }
    error.value = null

    console.log('🔄 [Profile] Fetching profile data...')

    // Fetch doctor profile from API
    const response = await api.doctors.getMe() as {
      success: boolean;
      doctor?: DoctorProfile
    }

    if (response.success && response.doctor) {
      profile.value = {
        id: response.doctor.id,
        email: response.doctor.email,
        rpps: response.doctor.rpps,
        kycStatus: response.doctor.kycStatus || 'pending',
        accountStatus: response.doctor.accountStatus || 'pending_validation',
        createdAt: response.doctor.createdAt,
      }
      console.log('✅ [Profile] Profile data loaded, KYC status:', profile.value.kycStatus)
    }
  } catch (err: unknown) {
    const errorObj = err as Error;
    console.error('❌ [Profile] Error fetching profile:', errorObj)
    error.value = 'Impossible de charger le profil'

    // If unauthorized, redirect to login
    if (errorObj.message?.includes('401') || errorObj.message?.includes('403')) {
      api.auth.logout()
      router.push('/login')
    }
  } finally {
    isLoading.value = false
  }
}

/**
 * Handle refresh request from KYC component
 */
function handleRefreshRequested() {
  console.log('🔄 [Profile] Refresh requested by KYC component')
  fetchProfile(true)
}

onMounted(() => {
  console.log('🔄 [Profile] Component mounted, fetching profile...')
  fetchProfile()
})

function handleKycStatusChange(newStatus: string) {
  if (profile.value) {
    profile.value.kycStatus = newStatus as 'verified' | 'rejected' | 'pending'
  }
}
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle as="h1">Mon Profil</CardTitle>
        <CardDescription>Gérez vos informations personnelles et votre vérification d'identité.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <div v-if="isLoading" class="text-center py-8">
          <p class="text-gray-500">Chargement...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <p class="text-red-600">{{ error }}</p>
        </div>

        <div v-else-if="profile" class="space-y-6">
          <!-- Profile Information -->
          <div class="border-b pb-6">
            <h2 class="text-lg font-semibold mb-4">Informations personnelles</h2>
            <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ profile.email }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Numéro RPPS</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ profile.rpps }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Statut du compte</dt>
                <dd class="mt-1">
                  <span
                    class="inline-flex rounded-full px-2 text-xs font-semibold leading-5"
                    :class="
                      profile.accountStatus === 'validated'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    "
                  >
                    {{
                      profile.accountStatus === 'validated'
                        ? 'Validé'
                        : 'En attente de validation'
                    }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Membre depuis</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ new Date(profile.createdAt).toLocaleDateString('fr-FR') }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- KYC Verification Section -->
          <div>
            <KycVerification
              :kyc-status="profile.kycStatus"
              @status-changed="handleKycStatusChange"
              @refresh-requested="handleRefreshRequested"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
