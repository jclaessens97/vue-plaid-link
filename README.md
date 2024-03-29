# @jcss/vue-plaid-link [![npm version](https://badge.fury.io/js/@jcss%2Fvue-plaid-link.svg)](https://badge.fury.io/js/@jcss%2Fvue-plaid-link)

[Vue](https://vuejs.org/) component for integrating with [Plaid Link](https://plaid.com/docs/link/)

This is an unofficial Vue fork based on the official React version [react-plaid-link](https://github.com/plaid/react-plaid-link).

### Compatibility

Vue 3.2+

### Install

With `npm`:

```
npm install --save @jcss/vue-plaid-link
```

With `yarn`

```
yarn add @jcss/vue-plaid-link
```

With `pnpm`

```
pnpm i @jcss/vue-plaid-link
```

## Documentation
Please refer to the [official Plaid Link docs](https://plaid.com/docs/link/)
for a more holistic understanding of Plaid Link.

## Examples

See the [examples folder](examples) for various complete source code examples.

## Using Vue Composables

This is the preferred approach for integrating with Plaid Link in Vue.

**Note:** `token` can be `null` initially and then set once you fetch or generate
a `link_token` asynchronously.

ℹ️ See a full source code examples of using composables:

- [examples/simple.vue](examples/simple.vue): minimal example of using composables
- [examples/composable.vue](examples/composable.vue): example using composable with all
  available callbacks
- [examples/oauth.vue](examples/oauth.vue): example handling OAuth with composable

```vue
<template>
  <button :disabled="!ready" @click="open">
    Connect a bank account
  </button>
</template>

<script lang="ts" setup>
import { usePlaidLink } from '@jcss/vue-plaid-link';

const { open, ready } = usePlaidLink({
  token: '<GENERATED_LINK_TOKEN>',
  onSuccess: (public_token, metadata) => {
    // send public_token to server
  },
});
</script>
```

### Available Link configuration options

ℹ️ See [src/types/index.ts](https://github.com/jclaessens97/vue-plaid-link/blob/c9e45fead47649c16c5ca9ca74bd22bee1ccabd9/src/types/index.ts) for exported types.

Please refer to the [official Plaid Link
docs](https://plaid.com/docs/link/web/) for a more holistic understanding of
the various Link options and the
[`link_token`](https://plaid.com/docs/api/tokens/#linktokencreate).

#### `usePlaidLink` arguments

| key                   | type                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `token`               | `string \| null`                                                                          |
| `receivedRedirectUri` | `string \| undefined`                                                             |
| `onSuccess`           | `(public_token: string, metadata: PlaidLinkOnSuccessMetadata) => void`                    |
| `onExit`              | `(error: PlaidLinkError \| null, metadata: PlaidLinkOnExitMetadata) => void`              |
| `onEvent`             | `(eventName: PlaidLinkStableEvent \| string, metadata: PlaidLinkOnEventMetadata) => void` |
| `onLoad`              | `() => void`                                                                              |

#### `usePlaidLink` return value

| key     | type                                                            |
| ------- | --------------------------------------------------------------- |
| `open`  | `() => void`                                                    |
| `ready` | `boolean`                                                       |
| `error` | `ErrorEvent \| null`                                            |
| `exit`  | `(options?: { force: boolean }, callback?: () => void) => void` |

## Using the pre-built component instead of the usePlaidLink composable

If you cannot use Vue composables for some reason, you can use the `PlaidLink` component.

ℹ️ See full source code example at [examples/component.vue](examples/component.vue)

```vue
<template>
  <PlaidLink
    :token="token"
    :on-success="onSuccess"
    :on-event="onEvent"
  >
    Connect a wallet
  </PlaidLink>
</template>

<script lang="ts" setup>
import type { PlaidLinkOnEvent, PlaidLinkOnSuccess } from '@jcss/vue-plaid-link';
import PlaidLink from '@jcss/vue-plaid-link';

// ...
</script>
```
