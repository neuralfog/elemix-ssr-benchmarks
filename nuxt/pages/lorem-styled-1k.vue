<script setup lang="ts">
const LOREM =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
const items = Array.from({ length: 1000 }, (_, i) => i);
</script>

<template>
    <div class="lorem">
        <LoremParagraphStyled
            v-for="i in items"
            :key="i"
            :index="i"
            :text="LOREM"
        />
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
