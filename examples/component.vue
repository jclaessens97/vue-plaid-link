<template>
  <PlaidLink
    :token="token"
    :on-success="onSuccess"
    :on-event="onEvent"
    :on-exit="onExit"
  >
    Connect a wallet
  </PlaidLink>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useFetch } from '@vueuse/core';
import type { PlaidLinkOnExit } from '../src/types';
import type { PlaidLinkOnEvent, PlaidLinkOnSuccess } from './plaid/types';
import PlaidLink from '@/plaid/PlaidLink.vue';

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

const { data } = useFetch<{ token: string }>('/api/create_link_token', { method: 'POST' });
const token = computed(() => {
  if (!data.value) { return ''; }
  return data.value.token;
});
</script>
