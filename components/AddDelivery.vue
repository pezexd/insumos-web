<script setup lang="ts">
import type { Database } from "~/types/supabase";

const client = useSupabaseClient<Database>();
const toast = useToast();

const show = ref(false);

const { data: supplies_options } = await useAsyncData(
  "supplies_options",
  async () => {
    if (!show.value) return [];

    const { data } = await client
      .from("supplies")
      .select("name, supply_id, current_stock");

    return data || [];
  },
  {
    transform: (input) =>
      input.map((i) => ({
        label: i.name,
        value: i.supply_id,
        stock: i.current_stock,
      })),
    watch: [show],
  }
);

const { data: maintenance_options } = await useAsyncData(
  "maintenance_options",
  async () => {
    if (!show.value) return [];

    const { data } = await client
      .from("maintenance_personnel")
      .select("full_name, maintenance_id");

    return data || [];
  },
  {
    transform: (input) =>
      input.map((i) => ({
        label: i.full_name,
        value: i.maintenance_id,
      })),
    watch: [show],
  }
);

const form = reactive<
  Partial<Database["public"]["Tables"]["deliveries"]["Row"]>
>({
  delivery_date: "",
  delivery_quantity: 0,
  maintenance_id: 0,
  observations: "",
  status: "pending",
  supply_id: 0,
});

const maxStock = computed(() => {
  if (!supplies_options.value) return 0;

  const supply = supplies_options.value.find((i) => i.value == form.supply_id);

  if (!supply) return 0;

  return supply.stock;
});

async function onComplete() {
  const { delivery } = useControl();

  const error = await delivery(form);

  if (!error) {
    toast.add({
      color: "red",
      description: "Problema al agregar la entrega",
    });
  }

  show.value = false;
  toast.add({
    color: "primary",
    description: "Entrega agregada correctamente",
  });
}
</script>

<template>
  <UButton
    variant="outline"
    label="Hacer Entrega"
    icon="i-heroicons-pencil-square"
    @click="show = true"
  />
  <UModal v-model="show" :overlay="true">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-200',
      }"
    >
      <template #header> Hacer Entrega </template>

      <div class="flex flex-col gap-4">
        <UFormGroup label="Suministro">
          <USelect v-model="form.supply_id" :options="supplies_options" />
        </UFormGroup>
        <UFormGroup label="Personal">
          <USelect
            v-model="form.maintenance_id"
            :options="maintenance_options"
          />
        </UFormGroup>
        <UFormGroup
          label="Cantidad (l/kg/c)"
          :help="`La cantidad maxima que puedes entregar es de: ${maxStock}`"
        >
          <UInput
            type="number"
            placeholder="1 - 1.5 - 0.7"
            :max="maxStock"
            v-model="form.delivery_quantity"
          />
        </UFormGroup>
        <UFormGroup label="Fecha de entrega">
          <UInput type="date" v-model="form.delivery_date" />
        </UFormGroup>
        <UFormGroup label="Observaciones">
          <UTextarea v-model="form.observations" />
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
