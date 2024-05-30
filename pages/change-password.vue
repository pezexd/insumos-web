<script setup lang="ts">
const supabase = useSupabaseClient();
const toast = useToast();

const form = reactive({
  password: "",
});

const onSubmit = async () => {
  const { error } = await supabase.auth.updateUser({
    password: form.password,
  });

  if (error) {
    toast.add({
      color: "red",
      icon: "i-heroicons-no-symbol",
      title: "Error",
      description:
        "Ocurrio un error al realizar la recuperación de la contraseña.",
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
          <UFormGroup label="Contraseña" help="Introduzca su nueva contraseña.">
            <UInput
              placeholder="********"
              icon="i-heroicons-lock-closed"
              v-model="form.password"
              type="password"
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
