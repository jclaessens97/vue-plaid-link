import { beforeAll, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import type { PlaidLinkOptions } from '../src';
import { ReadyState } from './constants';
import PlaidLinkTest from './PlaidLinkTest.vue';

vi.useFakeTimers();

const mockScriptLoad = vi.fn();
vi.mock('@vueuse/core', () => ({
  useScriptTag: vi.fn((_, cb) => {
    return {
      scriptTag: ref(null),
      load: mockScriptLoad.mockImplementation(() => {
        return new Promise((resolve) => {
          // Use this to fake a script load that takes 3 seconds.
          // We can advance the timers to simulate the script load using vi.advanceTimersByTime(3000) and await flushPromises()
          setTimeout(() => {
            cb();
            resolve(true);
          }, 3000);
        });
      }),
      unload: vi.fn(),
    };
  }),
}));

describe('usePlaidLink', () => {
  const config: PlaidLinkOptions = {
    token: 'test-token',
    onSuccess: vi.fn(),
  };

  const registeredCallbacks: Array<PlaidLinkOptions> = [];
  const destroyMock = vi.fn();

  beforeAll(() => {
    expect(PlaidLinkTest).toBeTruthy();

    vi.stubGlobal('Plaid', {
      create: (config: PlaidLinkOptions) => {
        registeredCallbacks.push(config);
        config.onLoad && config.onLoad();
        return {
          create: vi.fn(),
          open: vi.fn(),
          exit: vi.fn(),
          destroy: destroyMock,
        };
      },
      open: vi.fn(),
      exit: vi.fn(),
      destroy: vi.fn(),
    });
  });

  it('should render with token', async () => {
    const wrapper = mount(PlaidLinkTest, {
      props: {
        config,
      },
    });
    vi.advanceTimersByTime(3000);
    await flushPromises();

    expect(wrapper.get('button')).toBeTruthy();
    expect(wrapper.get('#ready').text()).toBe(ReadyState.READY);
    expect(wrapper.get('#error').text()).toBe(ReadyState.NO_ERROR);
  });

  it('should render with receivedRedirectUri', async () => {
    const configWithRedirectUri: PlaidLinkOptions = {
      ...config,
      token: null,
      receivedRedirectUri: 'test-received-redirect-uri',
    };
    const wrapper = mount(PlaidLinkTest, {
      props: {
        config: configWithRedirectUri,
      },
    });
    vi.advanceTimersByTime(3000);
    await flushPromises();

    expect(wrapper.get('button')).toBeTruthy();
    expect(wrapper.get('#ready').text()).toBe(ReadyState.READY);
  });

  it('should not be ready when script is loading', async () => {
    mockScriptLoad.mockImplementationOnce(() => {
      return new Promise(() => {});
    });

    const wrapper = mount(PlaidLinkTest, {
      props: {
        config,
      },
    });

    expect(wrapper.get('#ready').text()).toBe(ReadyState.NOT_READY);
    expect(wrapper.get('#error').text()).toBe(ReadyState.NO_ERROR);
  });

  it('should not be ready if token, and receivedRedirectUri are all missing', async () => {
    const configWithoutToken: PlaidLinkOptions = {
      ...config,
      token: null,
    };
    const wrapper = mount(PlaidLinkTest, {
      props: {
        config: configWithoutToken,
      },
    });

    expect(wrapper.get('#ready').text()).toBe(ReadyState.NOT_READY);
    expect(wrapper.get('#error').text()).toBe(ReadyState.NO_ERROR);
  });

  it('should not be ready if script fails to load', async () => {
    mockScriptLoad.mockImplementationOnce(() => {
      return Promise.reject(new Error('SCRIPT_LOAD_ERROR'));
    });

    const wrapper = mount(PlaidLinkTest, {
      props: {
        config,
      },
    });
    await flushPromises();

    expect(wrapper.get('#ready').text()).toBe(ReadyState.NOT_READY);
    expect(wrapper.get('#error').text()).toBe(ReadyState.ERROR);
  });

  it('should be ready if token is generated async', async () => {
    const wrapper = mount(PlaidLinkTest, {
      props: {
        config: {
          ...config,
          token: null,
        },
      },
    });
    vi.advanceTimersByTime(3000);
    await flushPromises();

    expect(wrapper.get('#ready').text()).toBe(ReadyState.NOT_READY);
    expect(wrapper.get('#error').text()).toBe(ReadyState.NO_ERROR);
    wrapper.setProps({ config: { ...config, token: 'test-token' } });
    await nextTick();
    expect(wrapper.get('#ready').text()).toBe(ReadyState.READY);
    expect(wrapper.get('#error').text()).toBe(ReadyState.NO_ERROR);
  });

  it('should be ready if token is generated async and script loads after token', async () => {
    const c: PlaidLinkOptions = {
      token: null,
      onSuccess: vi.fn(),
    };

    const wrapper = mount(PlaidLinkTest, {
      props: {
        config: c,
      },
    });

    expect(wrapper.get('#ready').text()).toBe(ReadyState.NOT_READY);
    expect(wrapper.get('#error').text()).toBe(ReadyState.NO_ERROR);

    wrapper.setProps({ config: { ...c, token: 'test-token' } });
    await nextTick();

    expect(wrapper.get('#ready').text()).toBe(ReadyState.NOT_READY);
    expect(wrapper.get('#error').text()).toBe(ReadyState.NO_ERROR);

    vi.advanceTimersByTime(3000);
    await flushPromises();

    wrapper.setProps({ config });
    await nextTick();

    expect(wrapper.get('#ready').text()).toBe(ReadyState.READY);
    expect(wrapper.get('#error').text()).toBe(ReadyState.NO_ERROR);
  });

  it('should not call old onSuccess handler after component remount', async () => {
    const firstOnSuccess = vi.fn();
    const secondOnSuccess = vi.fn();

    registeredCallbacks.length = 0;
    destroyMock.mockClear();

    const firstConfig: PlaidLinkOptions = {
      token: 'test-token-1',
      onSuccess: firstOnSuccess,
    };

    const wrapper = mount(PlaidLinkTest, {
      props: {
        config: firstConfig,
      },
    });

    vi.advanceTimersByTime(3000);
    await flushPromises();

    expect(wrapper.get('#ready').text()).toBe(ReadyState.READY);
    expect(registeredCallbacks.length).toBe(1);

    wrapper.unmount();
    await nextTick();

    const secondConfig: PlaidLinkOptions = {
      token: 'test-token-2',
      onSuccess: secondOnSuccess,
    };

    const wrapper2 = mount(PlaidLinkTest, {
      props: {
        config: secondConfig,
      },
    });

    vi.advanceTimersByTime(3000);
    await flushPromises();

    expect(wrapper2.get('#ready').text()).toBe(ReadyState.READY);
    expect(registeredCallbacks.length).toBe(2);

    registeredCallbacks.forEach((cb) => {
      cb.onSuccess('test-public-token', {
        institution: null,
        accounts: [],
        link_session_id: 'test-session-id',
      });
    });

    expect(firstOnSuccess).not.toHaveBeenCalled();
    expect(secondOnSuccess).toHaveBeenCalledTimes(1);
  });
});
