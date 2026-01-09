<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils.ts'
import RegisterForm from '@/components/forms/RegisterForm.vue'

</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Create an account</CardTitle>
      <CardDescription>
        Enter your information below to create your account
      </CardDescription>
    </CardHeader>
    <CardContent>
      <RegisterForm />
    </CardContent>
  </Card>
</template>
