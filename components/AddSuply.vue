<script setup lang="ts">
import type { Database } from "~/types/supabase";

const client = useSupabaseClient<Database>();
const toast = useToast();

const show = ref(false);

const form = reactive<Partial<Database["public"]["Tables"]["supplies"]["Row"]>>(
  {
    name: "",
    current_stock: 0,
    unit_of_measure: "kilo(s)",
  }
);

const onComplete = async () => {
  const { error } = await client.from("supplies").insert({
    name: form.name,
    current_stock: form.current_stock,
    unit_of_measure: form.unit_of_measure,
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
  <UButton
    variant="outline"
    label="Agregar Insumo"
    icon="i-heroicons-plus-circle"
    @click="show = true"
  />
  <UModal v-model="show" :overlay="true">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-200',
      }"
    >
      <template #header> Agregar Insumo </template>

      <div class="flex flex-col gap-4">
        <UFormGroup label="Nombre">
          <UInput type="text" v-model="form.name" />
        </UFormGroup>
        <UFormGroup label="Unidad de medida">
          <USelect
            v-model="form.unit_of_measure"
            :options="['kilo(s)', 'litro(s)', 'unidade(s)']"
          />
        </UFormGroup>
        <UFormGroup label="Cantidad Inicial">
          <UInput
            type="number"
            placeholder="1 - 1.5 - 0.7"
            v-model="form.current_stock"
          />
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
