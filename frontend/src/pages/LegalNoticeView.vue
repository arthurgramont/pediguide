<script setup lang="ts">
import ContainerUtil from '@/components/utils/ContainerUtil.vue'

const updatedAt = '09/01/2026'
</script>

<template>
  <ContainerUtil as="section">
    <div class="mx-auto w-full max-w-3xl space-y-8">
      <header class="space-y-2">
        <p class="text-sm text-muted-foreground">Dernière mise à jour : {{ updatedAt }}</p>
        <h1 class="text-h1 font-semibold text-foreground">Mentions légales</h1>
        <p class="text-body-lg text-muted-foreground">
          Cette page présente les informations légales obligatoires concernant PediGuide.
        </p>
      </header>

      <section class="space-y-3">
        <h2 class="text-h3 font-semibold text-foreground">Éditeur du site</h2>
        <ul class="space-y-1 text-sm text-muted-foreground">
          <li>Raison sociale : PediGuide (à compléter)</li>
          <li>Adresse : (à compléter)</li>
          <li>Contact : contact@pediguide.fr</li>
        </ul>
      </section>

      <section class="space-y-3">
        <h2 class="text-h3 font-semibold text-foreground">Hébergement</h2>
        <ul class="space-y-1 text-sm text-muted-foreground">
          <li>Hébergeur : (à compléter)</li>
          <li>Adresse : (à compléter)</li>
          <li>Téléphone : (à compléter)</li>
        </ul>
      </section>

      <section class="space-y-3">
        <h2 class="text-h3 font-semibold text-foreground">Propriété intellectuelle</h2>
        <p class="text-sm text-muted-foreground">
          L’ensemble des contenus (textes, visuels, logos, composants) est la propriété de
          PediGuide ou de ses partenaires. Toute reproduction non autorisée est interdite.
        </p>
      </section>

      <section class="space-y-3">
        <h2 class="text-h3 font-semibold text-foreground">Limitation de responsabilité</h2>
        <p class="text-sm text-muted-foreground">
          PediGuide propose un service d’aide à la pré-consultation. Il ne remplace pas un avis
          médical. En cas d’urgence, contactez les services compétents.
        </p>
      </section>
    </div>
  </ContainerUtil>
</template>
