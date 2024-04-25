<script setup lang="ts">
const supabase = useSupabaseClient();
const email = ref("");

const signInWithOtp = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: "http://localhost:3000/confirm",
    },
  });
  if (error) console.log(error);
};

definePageMeta({
  layout: "auth",
});
</script>
<template>
  <div class="flex flex-col justify-center items-center">
    <h1 class="text-3xl font-medium">Iniciar Sesion</h1>
    <UCard class="mt-10">
      <div class="flex flex-col gap-4">
        <UFormGroup label="Email">
          <UInput
            placeholder="you@example.com"
            icon="i-heroicons-envelope"
            v-model="email"
            type="email"
          />
        </UFormGroup>
        <UButton @click="signInWithOtp" block> Sign In with E-Mail </UButton>
      </div>
    </UCard>
  </div>
</template>
