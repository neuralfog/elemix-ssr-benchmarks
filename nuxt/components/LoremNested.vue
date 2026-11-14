<script setup lang="ts">
defineProps<{ index: number; text: string; depth: number }>();
</script>

<template>
    <div class="node">
        <p class="para">{{ index }}: {{ text }}</p>
        <LoremNested
            v-if="depth > 1"
            :index="index + 1"
            :text="text"
            :depth="depth - 1"
        />
    </div>
</template>

<style scoped>
.para {
    margin: 0;
    padding: 12px 16px;
    border-left: 3px solid #6366f1;
    border-radius: 6px;
    background: #ffffff;
    color: #1e293b;
    font: 14px/1.6 system-ui, sans-serif;
}
</style>
