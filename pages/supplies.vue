<script setup lang="ts">
let realtimeChannel: any;
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

onMounted(() => {
  realtimeChannel = client
    .channel("public:supplies")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "supplies" },
      () => {
        console.log("oaslal");
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
            color="primary"
            variant="solid"
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
            color="red"
            variant="solid"
            label="Entrega"
            icon="i-heroicons-minus-20-solid"
          />
        </div>
      </template>
    </UTable>
  </UCard>
  <SupplyModal v-model="supplyModal" />
  <GiveModal v-model="giveModal" />
  <!-- <UModal v-model="supplyModal" :overlay="true">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-200',
      }"
    >
      <template #header> Suministro </template>

      <div class="flex flex-col gap-4">
        <UFormGroup label="Cantidad (lt/kg/gr)">
          <UInput type="number" placeholder="1 - 1.5 - 0.7" />
        </UFormGroup>
        <UFormGroup label="Fecha de suministro">
          <UInput type="date" />
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton label="Completar" />
        </div>
      </template>
    </UCard>
  </UModal> -->
</template>
