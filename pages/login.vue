<script setup lang="ts">
const supabase = useSupabaseClient();
const toast = useToast();

const form = reactive({
  email: "",
  password: "",
});

const onSubmit = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  });

  if (error) {
    toast.add({
      color: "red",
      icon: "i-heroicons-no-symbol",
      title: "Error",
      description: "Credenciales de acceso no válidas",
    });

    return;
  }

  return navigateTo("/supplies");
};

definePageMeta({
  layout: "auth",
});
</script>
<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2
        class="mt-6 text-center text-2xl font-bold tracking-tight text-stone-900"
      >
        Insumos Web
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <UCard>
        <UForm :state="form" @submit="onSubmit" class="space-y-6">
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

          <div class="flex items-center justify-between">
            <UButton
              :padded="false"
              to="recovery"
              variant="link"
              label="Olvidaste la contraseña?"
            />
          </div>

          <UButton type="submit" block> Iniciar sesion </UButton>
        </UForm>
      </UCard>
    </div>
  </div>
</template>
