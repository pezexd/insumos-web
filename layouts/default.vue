<script setup lang="ts">
const supabase = useSupabaseClient();

const navigation = [
  { label: "Insumos", icon: "i-heroicons-chart-bar", to: "/supplies" },
  { label: "Equipo", icon: "i-heroicons-users", to: "/" },
];

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    return;
  }

  return navigateTo("/login");
};

const settingsNavigation = [
  { label: "Ajustes", to: "#" },
  { label: "Salir", to: "#", click: logout },
];
</script>

<template>
  <Html class="h-full bg-gray-100">
    <Body class="h-full">
      <div class="min-h-full">
        <nav class="bg-white shadow-sm">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-16 justify-between">
              <div class="flex">
                <div class="flex flex-shrink-0 items-center">
                  <img class="block h-8 w-auto" src="/logo.png" alt="UGMA" />
                </div>
                <UHorizontalNavigation class="ml-6" :links="navigation" />
              </div>
              <div class="ml-6 flex items-center">
                <UPopover>
                  <UButton
                    color="white"
                    trailing-icon="i-heroicons-cog-6-tooth-20-solid"
                  />

                  <template #panel>
                    <div class="p-0.5">
                      <UVerticalNavigation :links="settingsNavigation" />
                    </div>
                  </template>
                </UPopover>
              </div>
            </div>
          </div>
        </nav>

        <div class="py-10">
          <main>
            <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
              <slot />
            </div>
          </main>
        </div>
      </div>
    </Body>
  </Html>
</template>
