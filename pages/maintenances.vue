<script setup lang="ts">
import type { Database } from "~/types/supabase";

const client = useSupabaseClient<Database>();
const toast = useToast();

const { data: team, refresh: refreshTeam } = await useAsyncData(
  "team",
  async () => {
    const { data } = await client
      .from("maintenance_personnel")
      .select("maintenance_id, full_name, assignment_area");

    return data;
  }
);

const columns = [
  {
    key: "full_name",
    label: "Nombre de Personal",
  },
  {
    key: "assignment_area",
    label: "Area",
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
        await client
          .from("maintenance_personnel")
          .delete()
          .eq("maintenance_id", row.maintenance_id);
        toast.add({
          description: "Personal eliminado!",
        });
        refreshTeam();
      },
    },
  ],
];

let realtimeChannel: any;

onMounted(() => {
  realtimeChannel = client
    .channel("public:maintenance_personnel")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "maintenance_personnel" },
      () => {
        refreshTeam();
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
        padding: 'p-2 sm:p-2',
      },
    }"
    class="mb-2"
  >
    <AddMaintenance />
  </UCard>
  <UCard
    :ui="{
      body: {
        padding: 'p-0 sm:p-0',
      },
    }"
  >
    <UTable :key="team" :columns="columns" :rows="team">
      <template #actions-data="{ row }">
        <div class="flex justify-end">
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
