<script setup lang="ts">
import type { Database } from "~/types/supabase";

const client = useSupabaseClient<Database>();

const { data: team, refresh: refreshTeam } = await useAsyncData(
  "team",
  async () => {
    const { data } = await client
      .from("maintenance_personnel")
      .select("full_name, assignment_area");

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
  <div class="flex mb-4">
    <AddMaintenance />
  </div>
  <UCard
    :ui="{
      body: {
        padding: 'p-0 sm:p-0',
      },
    }"
  >
    <UTable :key="team" :columns="columns" :rows="team" />
  </UCard>
</template>
