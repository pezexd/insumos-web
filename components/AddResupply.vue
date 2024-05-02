<script setup lang="ts">
import type { Database } from "~/types/supabase";

const client = useSupabaseClient<Database>();
const toast = useToast();

const show = ref(false);

const { data: supplies_options } = await useAsyncData(
  "supplies_options",
  async () => {
    if (!show.value) return [];

    const { data } = await client.from("supplies").select("name, supply_id");

    return data || [];
  },
  {
    transform: (input) =>
      input.map((i) => ({
        label: i.name,
        value: i.supply_id,
      })),
    watch: [show],
  }
);

const form = reactive<
  Partial<Database["public"]["Tables"]["replenishments"]["Row"]>
>({
  resupply_date: "",
  resupply_quantity: 0,
  supply_id: 0,
});

async function onComplete() {
  const { replenishment } = useControl();

  const error = await replenishment(form);

  if (!error) {
    toast.add({
      color: "red",
      description: "Problema al reabastecer",
    });
  }

  show.value = false;
  toast.add({
    color: "primary",
    description: "Reabastecimiento correcto",
  });
}
</script>

<template>
  <UButton label="Hacer Reabastecimiento" @click="show = true" />
  <UModal v-model="show" :overlay="true">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-200',
      }"
    >
      <template #header> Hacer Reabastecimiento </template>

      <div class="flex flex-col gap-4">
        <UFormGroup label="Suministro">
          <USelect v-model="form.supply_id" :options="supplies_options" />
        </UFormGroup>
        <UFormGroup label="Cantidad (l/kg/c)">
          <UInput
            type="number"
            placeholder="1 - 1.5 - 0.7"
            v-model="form.resupply_quantity"
          />
        </UFormGroup>
        <UFormGroup label="Fecha de reabastecimiento">
          <UInput type="date" v-model="form.resupply_date" />
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
