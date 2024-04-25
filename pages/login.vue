<script setup lang="ts">
const supabase = useSupabaseClient();

const form = reactive({
  email: "",
  password: "",
});

const signIn = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  });

  if (error) {
    console.log(error);
    return;
  }

  return navigateTo("/supplies");
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
            v-model="form.email"
            type="email"
          />
        </UFormGroup>
        <UFormGroup label="Contraseña">
          <UInput
            placeholder="********"
            icon="i-heroicons-lock-closed"
            v-model="form.password"
            type="password"
          />
        </UFormGroup>
        <UButton @click="signIn" block> Iniciar sesion </UButton>
      </div>
    </UCard>
  </div>
</template>
