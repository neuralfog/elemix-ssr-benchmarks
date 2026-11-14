<script setup lang="ts">
const LOREM =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
const items = Array.from({ length: 10000 }, (_, i) => i);
</script>

<template>
    <div class="lorem">
        <LoremParagraph
            v-for="i in items"
            :key="i"
            :index="i"
            :text="LOREM"
        />
    </div>
</template>
