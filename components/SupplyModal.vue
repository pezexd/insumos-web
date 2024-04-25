<script setup lang="ts">
const state = useControlState();
const model = defineModel();

const form = reactive({
  quantity: null,
  date: null,
});

const onComplete = async () => {
  const { supply } = useControl();

  await supply(state.value.selectedId, form.quantity, form.date);
  model.value = false;
};
</script>

<template>
  <UModal v-model="model" :overlay="true">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-200',
      }"
    >
      <template #header> Suministro </template>

      <div class="flex flex-col gap-4">
        <UFormGroup label="Cantidad (lt/kg/gr)">
          <UInput
            type="number"
            placeholder="1 - 1.5 - 0.7"
            v-model="form.quantity"
          />
        </UFormGroup>
        <UFormGroup label="Fecha de suministro">
          <UInput type="date" v-model="form.date" />
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
