<script setup lang="ts">
const client = useSupabaseClient();
const state = useControlState();

const { data: supplies, refresh: refreshSupplies } = await useAsyncData(
  "supplies",
  async () => {
    const { data } = await client.from("supplies").select("id, name, stock");

    return data;
  }
);

const columns = [
  {
    key: "name",
    label: "Nombre",
  },
  {
    key: "stock",
    label: "Stock",
  },
  {
    key: "actions",
    label: "Acciones",
  },
];

const supplyModal = ref(false);
const giveModal = ref(false);

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
  <div class="flex mb-4">
    <AddSuply />
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
          <UButton
            @click="
              () => {
                state.selectedId = row.id;
                supplyModal = true;
              }
            "
            color="gray"
            label="Suministro"
            icon="i-heroicons-plus-20-solid"
          />
          <UButton
            @click="
              () => {
                state.selectedId = row.id;
                giveModal = true;
              }
            "
            color="gray"
            label="Entrega"
            icon="i-heroicons-minus-20-solid"
          />
        </div>
      </template>
    </UTable>
  </UCard>
  <SupplyModal v-model="supplyModal" />
  <GiveModal v-model="giveModal" />
</template>
