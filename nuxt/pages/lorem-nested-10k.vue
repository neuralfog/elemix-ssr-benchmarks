<script setup lang="ts">
const LOREM =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
</script>

<template>
    <div class="lorem">
        <LoremNested :index="0" :text="LOREM" :depth="10000" />
    </div>
</template>

<style scoped>
.lorem {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px;
    max-width: 720px;
    margin: 0 auto;
    background: #f1f5f9;
}
</style>
