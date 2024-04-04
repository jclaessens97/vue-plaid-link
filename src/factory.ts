import { PlaidSDKError } from './types/error';
import type { PlaidExitOptions, PlaidHandler, PlaidLinkOptions } from './types';

export interface PlaidFactory {
  open: () => void;
  exit: (exitOptions: PlaidExitOptions, callback: () => void) => void;
  destroy: () => void;
}

interface FactoryInternalState {
  plaid: PlaidHandler | null;
  open: boolean;
  onExitCallback: (() => void) | null | Function;
}

function createPlaidHandler(config: PlaidLinkOptions, creator: (config: PlaidLinkOptions) => PlaidHandler) {
  const state: FactoryInternalState = {
    plaid: null,
    open: false,
    onExitCallback: null,
  };

  if (typeof window === 'undefined' || !window.Plaid) {
    throw new PlaidSDKError();
  }

  state.plaid = creator({
    ...config,
    onExit: (err, metadata) => {
      state.open = false;
      config.onExit && config.onExit(err, metadata);
      state.onExitCallback && state.onExitCallback();
    },
  });

  const open = () => {
    if (!state.plaid) {
      return;
    }
    state.open = true;
    state.onExitCallback = null;
    state.plaid?.open();
  };

  const exit = (exitOptions: PlaidExitOptions, callback: (() => void)) => {
    if (!state.open || !state.plaid) {
      callback && callback();
      return;
    }
    state.onExitCallback = callback;
    state.plaid.exit(exitOptions);
    if (exitOptions && exitOptions.force) {
      state.open = false;
    }
  };

  const destroy = () => {
    if (!state.plaid) {
      return;
    }
    state.plaid.destroy();
    state.plaid = null;
  };

  return {
    open,
    exit,
    destroy,
  };
}

export function createPlaid(options: PlaidLinkOptions, creator: (options: PlaidLinkOptions) => PlaidHandler) {
  return createPlaidHandler(options, creator);
}
