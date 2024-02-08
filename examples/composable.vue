<template>
  <button :disabled="!ready" @click="open">
    Connect a bank account
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useFetch } from '@vueuse/core';
import type { PlaidLinkOnEvent, PlaidLinkOnExit, PlaidLinkOnSuccess, PlaidLinkOptions } from '@jcss/vue-plaid-link';
import { usePlaidLink } from '@jcss/vue-plaid-link';

const { data } = useFetch<{ link_token: string }>('/api/create_link_token', { method: 'POST' });
const token = computed(() => {
  if (!data.value) { return ''; }
  return data.value.link_token;
});

const onSuccess: PlaidLinkOnSuccess = (publicToken, metadata) => {
  // send public_token to your server
  // https://plaid.com/docs/api/tokens/#token-exchange-flow
  console.log(publicToken, metadata);
};

const onEvent: PlaidLinkOnEvent = (eventName, metadata) => {
  // log onEvent callbacks from Link
  // https://plaid.com/docs/link/web/#onevent
  console.log(eventName, metadata);
};

const onExit: PlaidLinkOnExit = (error, metadata) => {
  // log onExit callbacks from Link, handle errors
  // https://plaid.com/docs/link/web/#onexit
  console.log(error, metadata);
};

const config = computed(() => {
  const config: PlaidLinkOptions = {
    token: token.value,
    onSuccess,
    onEvent,
    onExit,
  };
  return config;
});

const { open, ready } = usePlaidLink(config);
</script>
