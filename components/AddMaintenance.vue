<script setup lang="ts">
import type { Database } from "~/types/supabase";

const client = useSupabaseClient<Database>();
const toast = useToast();

const show = ref(false);

const form = reactive<
  Partial<Database["public"]["Tables"]["maintenance_personnel"]["Row"]>
>({
  full_name: "",
  assignment_area: "",
});

const onComplete = async () => {
  const { error } = await client.from("maintenance_personnel").insert({
    full_name: form.full_name,
    assignment_area: form.assignment_area,
  });

  show.value = false;

  if (error) {
    toast.add({
      color: "red",
      description: "Problema al agregar el insumo",
    });

    return;
  }

  toast.add({
    color: "primary",
    description: "Insumo agregado correctamente",
  });
};
</script>

<template>
  <UButton label="Agregar personal" @click="show = true" />
  <UModal v-model="show" :overlay="true">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-200',
      }"
    >
      <template #header> Agregar Personal de Mantenimiento </template>

      <div class="flex flex-col gap-4">
        <UFormGroup label="Nombre de Personal">
          <UInput type="text" v-model="form.full_name" />
        </UFormGroup>
        <UFormGroup label="Area">
          <UInput type="text" v-model="form.assignment_area" />
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton @click="onComplete" label="Completar" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>
