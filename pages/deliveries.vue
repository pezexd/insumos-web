<script setup lang="ts">
import type { Database } from "~/types/supabase";

const client = useSupabaseClient<Database>();
const toast = useToast();

const { data: deliveries, refresh: refreshDeliveries } = await useAsyncData(
  "deliveries",
  async () => {
    const { data } = await client
      .from("deliveries")
      .select(
        "delivery_id, supply_id, maintenance_id, delivery_date, delivery_quantity, observations, status, supplies(name), maintenance_personnel(full_name)"
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
  {
    key: "actions",
  },
];

const items = (row: any) => [
  [
    {
      label: "Pendiente",
      icon: "i-heroicons-clock",
      click: async () => {
        await client
          .from("deliveries")
          .update({
            status: "pending",
          })
          .eq("delivery_id", row.delivery_id);
        refreshDeliveries();
      },
    },
    {
      label: "Completado",
      icon: "i-heroicons-check-circle",
      click: async () => {
        await client
          .from("deliveries")
          .update({
            status: "completed",
          })
          .eq("delivery_id", row.delivery_id);
        refreshDeliveries();
      },
    },
  ],
  [
    {
      label: "Eliminar",
      icon: "i-heroicons-trash",
      click: async () => {
        await client
          .from("deliveries")
          .delete()
          .eq("delivery_id", row.delivery_id);
        toast.add({
          description: "Entrega eliminada!",
        });
        refreshDeliveries();
      },
    },
  ],
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
  <UCard
    :ui="{
      body: {
        base: 'space-x-2',
        padding: 'p-2 sm:p-2',
      },
    }"
    class="mb-2"
  >
    <AddDelivery />
  </UCard>
  <UCard
    :ui="{
      body: {
        padding: 'p-0 sm:p-0',
      },
    }"
  >
    <UTable :key="deliveries" :columns="columns" :rows="deliveries">
      <template #status-data="{ row }">
        <div>
          <template v-if="row.status == 'pending'">
            <UBadge
              variant="subtle"
              color="amber"
              :ui="{ rounded: 'rounded-full' }"
            >
              Pendiente
            </UBadge>
          </template>
          <template v-else-if="row.status == 'completed'">
            <UBadge
              variant="subtle"
              color="green"
              :ui="{ rounded: 'rounded-full' }"
            >
              Entregado
            </UBadge>
          </template>
        </div>
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
    </UTable>
  </UCard>
</template>
