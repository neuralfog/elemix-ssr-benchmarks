<script setup lang="ts">
defineProps<{ index: number; text: string }>();
</script>

<template>
    <p class="para">{{ index }}: {{ text }}</p>
</template>
