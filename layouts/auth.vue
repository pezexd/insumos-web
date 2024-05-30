<script setup lang="ts"></script>

<template>
  <Html class="h-full bg-white font-['Poppins']">
    <Body class="h-full">
      <div
        class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
      >
        <slot />
      </div>
    </Body>
  </Html>
</template>
