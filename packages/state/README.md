# @innu/state

`@innu/state` is a library designed to streamline state management using async functions that resemble the behavior of reducers in Redux. Unlike Redux, this library does not include a built-in state manager, allowing you to integrate it seamlessly with your preferred state management solution such as [`zustand`](https://github.com/pmndrs/zustand) or [`jotai`](https://github.com/pmndrs/jotai).

> Note: More details about the motivation behind creating this library and its underlying philosophy can be found in the [Appendix](#appendix) section.

## Usage

For demonstration purposes, we'll illustrate how to use `@innu/state` with `zustand` as the state management library. However, it can be adapted to work with any library that offers similar `getState` and `setState` APIs.

### Terminology:

To clarify the terminology used in `@innu/state` compared to Redux, here are the equivalent terms:

| Name    | Meaning                                                  | Equivalent Redux Function |
| ------- | -------------------------------------------------------- | ------------------------- |
| `toss`  | A function used to toss actions                          | `dispatch`                |
| `taker` | A function that takes tossed actions and returns a state | `reducer`                 |

Consider the following code:

```typescript
// state.ts
import { create } from 'zustand';
import { make } from '@innu/state';
import type { MainActions, MainState } from './types.ts'; // Assume these are defined.

export const [attach] = make(
  create({
    //... define initial state here.
  })
);

export const [mainToss] = attach<MainState, MainActions>(async (getState, action, tossLocal) => {
  // ... async logic here to handle actions
});
```

Now, you can toss actions of type `MainActions` using the `toss` function exported. Additionally, you can use the `attach` function again to add additional takers, enabling multiple reducers to operate on the same state object. For example:

```typescript
import { attach, mainToss } from 'state.ts';
import { PopupActions, PopupState } from './page2.types.ts';

export const [tossPopup] = attach<PopupState, PopupActions>(async (getState, action, tossLocal) => {
  // ... page 2 logic here.
  await mainToss({
    // Example: logging a user out
  });
  // ... additional logic
});
```

This approach addresses several challenges encountered with traditional reducers:

1. Async logic is seamlessly integrated without the need for extra libraries.
2. Actions can be tossed from within a reducer, simplifying action orchestration.
3. Lazy-loaded modules can dynamically add their own slice after loading, with the potential for cleanup functionality.
4. Orchestration between state slices is simplified, similar to tracking file dependencies in a codebase.

# Appendix

## Why Was This Library Created?

### Background

Previously, at my workplace, we explored the concept of "async reducers" similar to Redux but with asynchronous capabilities. Although we encountered challenges and complexities, we found the approach intuitive and effective, albeit with certain pitfalls. While the initial experiment was discontinued, the idea continued to intrigue me, leading to the development of `@innu/state`.

### Async Reducers

If Redux's synchronous reducers are like pure mathematical functions, the async takers in `@innu/state` resemble filters used in audio processing, introducing delays and echoes. This concept allows actions to interact with an already "playing" state, offering unique possibilities for state management.

TODO: Expand on philosophy, history, and rationale behind `@innu/state`.
