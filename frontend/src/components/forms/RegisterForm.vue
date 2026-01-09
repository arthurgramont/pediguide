<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
</script>

<template>
  <form>
    <FieldGroup>
      <Field>
        <FieldLabel for="rpps-number"> Numéro RPPS </FieldLabel>
        <Input
          id="rpps-number"
          type="text"
          name="rppsNumber"
          autocomplete="off"
          placeholder="Entrez votre numéro RPPS"
          required
        />
      </Field>
      <Field>
        <FieldLabel for="email"> Email </FieldLabel>
        <Input
          id="email"
          type="email"
          name="email"
          autocomplete="email"
          placeholder="Entrez votre email"
          required
        />
      </Field>
      <Field>
        <FieldLabel for="password"> Mot de passe </FieldLabel>
        <Input
          id="password"
          type="password"
          name="password"
          autocomplete="new-password"
          placeholder="Entrez votre mot de passe"
          required
        />
      </Field>
      <Field>
        <FieldLabel for="confirm-password"> Confirmation </FieldLabel>
        <Input
          id="confirm-password"
          type="password"
          name="confirmPassword"
          autocomplete="new-password"
          placeholder="Confirmez votre mot de passe"
          required
        />
      </Field>
      <Field>
        <FieldLabel for="cps-card"> Carte CPS </FieldLabel>
        <Input id="cps-card" type="file" name="cpsCard" required />
      </Field>
      <FieldGroup>
        <Field>
          <Button type="submit"> Create Account </Button>
          <FieldDescription class="px-6 text-center">
            Already have an account?
            <RouterLink
              to="/login"
            >
              Sign in
            </RouterLink>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldGroup>
  </form>
</template>
