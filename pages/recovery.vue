<script setup lang="ts">
const supabase = useSupabaseClient();
const toast = useToast();
const url = useRequestURL();

const form = reactive({
  email: "",
});

const onSubmit = async () => {
  const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
    redirectTo: `${url.origin}/change-password`,
  });

  if (error) {
    toast.add({
      color: "red",
      icon: "i-heroicons-no-symbol",
      title: "Error",
      description:
        "La recuperación de la contraseña requiere un correo electrónico",
    });
    return;
  }

  return navigateTo("/login");
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
        Recuperación
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <UCard>
        <UForm :state="form" @submit="onSubmit" class="space-y-6">
          <UFormGroup
            label="Email"
            help="Introduzca su dirección de correo electrónico para proceder con la recuperación de su contraseña."
          >
            <UInput
              placeholder="you@example.com"
              icon="i-heroicons-envelope"
              v-model="form.email"
              type="email"
            />
          </UFormGroup>

          <div class="flex justify-between items-center">
            <UButton to="/login" color="gray"> Volver </UButton>
            <UButton type="submit"> Confirmar </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>
