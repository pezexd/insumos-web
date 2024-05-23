<script setup lang="ts">
import type { Database } from "~/types/supabase";

const client = useSupabaseClient<Database>();
const toast = useToast();

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
    label: "Insumo",
  },
  {
    key: "current_stock",
    label: "Stock",
  },
  {
    key: "actions",
  },
];

const items = (row: any) => [
  [
    {
      label: "Eliminar",
      icon: "i-heroicons-trash",
      click: async () => {
        await client.from("supplies").delete().eq("supply_id", row.supply_id);
        toast.add({
          description: "Insumo eliminado!",
        });
      },
    },
  ],
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
  <UCard
    :ui="{
      body: {
        base: 'space-x-2',
        padding: 'p-2 sm:p-2',
      },
    }"
    class="mb-2"
  >
    <AddSuply />
    <AddResupply />
  </UCard>
  <UCard
    :ui="{
      body: {
        padding: 'p-0 sm:p-0',
      },
    }"
  >
    <UTable :key="supplies" :columns="columns" :rows="supplies">
      <template #actions-data="{ row }">
        <div class="flex justify-end gap-2">
          <AddDelivery />

          <UDropdown :items="items(row)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </div>
      </template>
    </UTable>
  </UCard>
</template>
