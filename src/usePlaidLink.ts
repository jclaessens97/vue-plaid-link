import type { Ref } from 'vue';
import { computed, ref, watch } from 'vue';
import { useScriptTag } from '@vueuse/core';
import { PLAID_LINK_STABLE_URL } from './constants';
import { PlaidSDKError } from './types/error';
import { type PlaidFactory, createPlaid } from './factory';
import type { PlaidExitOptions, PlaidLinkOptions } from './types';

function loadPlaidSdk() {
  const isPlaidLoading = ref(true);
  const error = ref<Error | null>(null);

  const { load } = useScriptTag(
    PLAID_LINK_STABLE_URL,
    () => {
      isPlaidLoading.value = false;
    },
  );

  load().catch((err) => {
    error.value = err;
  }); ;
  return { isPlaidLoading, error };
}

export default function usePlaidLink(options: Ref<PlaidLinkOptions>) {
  const { isPlaidLoading, error } = loadPlaidSdk();

  const plaid = ref<PlaidFactory | null>(null);
  const iframeLoaded = ref(false);

  watch(
    [options, isPlaidLoading],
    () => {
      if (isPlaidLoading.value) {
        return;
      }

      if (!options.value.token && !options.value.receivedRedirectUri) {
        return;
      }

      if (!window.Plaid) {
        throw new PlaidSDKError();
      }

      if (plaid.value) {
        plaid.value.exit({ force: true }, () => plaid.value?.destroy());
      }

      const next = createPlaid({
        ...options.value,
        onLoad: () => {
          iframeLoaded.value = true;
          options.value.onLoad && options.value.onLoad();
        },
      }, window.Plaid.create);

      plaid.value = next;

      return () => next.exit({ force: true }, () => next.destroy());
    },
    {
      immediate: true,
    },
  );

  const ready = computed(() => !error.value && plaid.value != null && (!isPlaidLoading.value || iframeLoaded.value));

  return {
    ready,
    error,
    open: () => {
      if (plaid.value) {
        plaid.value.open();
      }
    },
    exit: (exitOptions: PlaidExitOptions, callback: () => void) => {
      if (plaid.value) {
        plaid.value.exit(exitOptions, callback);
      }
    },
  };
}
