<script setup lang="ts">
import type { Database } from "~/types/supabase";

const client = useSupabaseClient<Database>();

const { data: deliveries, refresh: refreshDeliveries } = await useAsyncData(
  "deliveries",
  async () => {
    const { data } = await client
      .from("deliveries")
      .select(
        "supply_id, maintenance_id, delivery_date, delivery_quantity, observations, status, supplies(name), maintenance_personnel(full_name)"
      );

    return data;
  }
);

const columns = [
  {
    key: "supplies.name",
    label: "Insumo",
  },
  {
    key: "maintenance_personnel.full_name",
    label: "Personal de Mantenimiento",
  },
  {
    key: "delivery_date",
    label: "Fecha",
  },
  {
    key: "delivery_quantity",
    label: "Cantidad",
  },
  {
    key: "observations",
    label: "Observaciones",
  },
  {
    key: "status",
    label: "Estatus",
  },
];

let realtimeChannel: any;

onMounted(() => {
  realtimeChannel = client
    .channel("public:deliveries")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "deliveries" },
      () => {
        refreshDeliveries();
      }
    );

  realtimeChannel.subscribe();
});

onUnmounted(() => {
  client.removeChannel(realtimeChannel);
});
</script>

<template>
  <div class="flex mb-4">
    <AddDelivery />
  </div>
  <UCard
    :ui="{
      body: {
        padding: 'p-0 sm:p-0',
      },
    }"
  >
    <UTable :key="deliveries" :columns="columns" :rows="deliveries" />
  </UCard>
</template>
