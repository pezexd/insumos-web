<script setup lang="ts">
import type { Database } from "~/types/supabase";

const client = useSupabaseClient<Database>();

const { data: supplies, refresh: refreshSupplies } = await useAsyncData(
  "supplies",
  async () => {
    const { data } = await client
      .from("supplies")
      .select("supply_id, name, current_stock");

    return data;
  }
);

const columns = [
  {
    key: "name",
    label: "Nombre",
  },
  {
    key: "current_stock",
    label: "Stock",
  },
  {
    key: "actions",
    label: "Acciones",
  },
];

let realtimeChannel: any;

onMounted(() => {
  realtimeChannel = client
    .channel("public:supplies")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "supplies" },
      () => {
        refreshSupplies();
      }
    );

  realtimeChannel.subscribe();
});

onUnmounted(() => {
  client.removeChannel(realtimeChannel);
});
</script>

<template>
  <div class="flex gap-2 mb-4">
    <AddSuply />
    <AddResupply />
  </div>
  <UCard
    :ui="{
      body: {
        padding: 'p-0 sm:p-0',
      },
    }"
  >
    <UTable :key="supplies" :columns="columns" :rows="supplies">
      <template #actions-data="{ row }">
        <div class="flex gap-2">
          <AddDelivery />
        </div>
      </template>
    </UTable>
  </UCard>
</template>
