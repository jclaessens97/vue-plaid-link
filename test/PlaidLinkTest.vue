<template>
  <div>
    <button @click="open">
      Open
    </button>
    <div id="ready">
      {{ ready ? ReadyState.READY : ReadyState.NOT_READY }}
    </div>
    <div id="error">
      {{ error ? ReadyState.ERROR : ReadyState.NO_ERROR }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { PlaidLinkOptions } from '../src';
import { usePlaidLink } from '../src';
import { ReadyState } from './constants';

const props = defineProps<{
  config: PlaidLinkOptions;
}>();

const configRef = computed(() => props.config);

const { open, ready, error } = usePlaidLink(configRef);
</script>
