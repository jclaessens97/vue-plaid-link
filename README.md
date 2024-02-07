# @jcss/vue-plaid-link

[Vue](https://vuejs.org/) component for integrating with [Plaid Link](https://plaid.com/docs/link/)

This is an unnoficial Vue fork based on the official React version [react-plaid-link](https://github.com/plaid/react-plaid-link).

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

### Available Link configuration options

ℹ️ See (src/types/index.ts)[https://github.com/jclaessens97/vue-plaid-link/blob/c9e45fead47649c16c5ca9ca74bd22bee1ccabd9/src/types/index.ts] for exported types.

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

## Notes

I don't have a lot of spare time to actively maintain this project. I could only put this package up so Plaid can refer to it: https://github.com/plaid/react-plaid-link/issues/330 since I implemented it for a side-project of mine.

Currently only the regular, [non-deprecated](https://plaid.com/docs/link/link-token-migration-guide/) flow is implemented, without web3 and without oauth support. Feel free to open PR's to add this. I might add it myself if I see the need in my own side-project.
