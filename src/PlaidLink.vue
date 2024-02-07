<template>
  <button
    :disabled="!ready"
    type="button"
    @click="open"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { PlaidLinkOptions } from './types';
import usePlaidLink from './usePlaidLink';

const props = defineProps<PlaidLinkOptions>();

const options = computed(() => ({ ...props }));

const { ready, open } = usePlaidLink(options);
</script>

<script lang="ts">
export default {
  name: 'PlaidLink',
};
</script>
