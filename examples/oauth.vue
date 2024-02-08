<template>
  <button v-if="!isOAuthRedirect" @click="open">
    Connect a bank account
  </button>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useFetch } from '@vueuse/core';
import type { PlaidLinkOnEvent, PlaidLinkOnExit, PlaidLinkOnSuccess, PlaidLinkOptions } from '@jcss/vue-plaid-link';
import { usePlaidLink } from '@jcss/vue-plaid-link';

const token = ref<string | null>(null);
const isOAuthRedirect = window.location.href.includes('?oauth_state_id=');

const { data } = useFetch<{ link_token: string }>('/api/create_link_token', { method: 'POST' });
watch(data, (newData) => {
  if (!newData) {
    return;
  }
  const { link_token } = newData;
  token.value = link_token;
  localStorage.setItem('link_token', link_token);
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
  if (isOAuthRedirect) {
    config.receivedRedirectUri = window.location.href;
  }
  return config;
});

const {
  ready,
  open,
  // exit,
} = usePlaidLink(config);

watch(ready, (isReady) => {
  if (isOAuthRedirect && isReady) {
    open();
  }
});

onMounted(() => {
  if (isOAuthRedirect) {
    token.value = window.localStorage.getItem('link_token');
  }
});
</script>
