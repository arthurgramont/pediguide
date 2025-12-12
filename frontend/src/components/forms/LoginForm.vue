<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
</script>

<template>
  <form>
    <FieldGroup>
      <Field>
        <FieldLabel for="email"> Email </FieldLabel>
        <Input id="email" type="email" placeholder="Enter your email" required />
      </Field>
      <Field>
        <div class="flex items-center">
          <FieldLabel for="password"> Password </FieldLabel>
          <a href="#" class="ml-auto inline-block text-sm underline-offset-4 hover:underline">
            Forgot your password?
          </a>
        </div>
        <Input id="password" type="password" placeholder="Enter your password" required />
      </Field>
      <Field>
        <Button type="submit"> Login </Button>
        <FieldDescription class="text-center">
          Don't have an account?
          <RouterLink
            to="/register"
          >
            Sign up
          </RouterLink>
        </FieldDescription>
      </Field>
    </FieldGroup>
  </form>
</template>
