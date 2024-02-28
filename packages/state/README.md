# @innu/state

This library helps manage your state using async functions that operate a bit like [redux](https://redux.js.org/)'s [reducers](https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#writing-reducers). This library does not act as a state manager, but allows you to use any state management solution like [`zustand`](https://github.com/pmndrs/zustand) or [`jotai`](https://github.com/pmndrs/jotai).

> Note: There is more on why this library was created and the philosophy around it in the [Appendix](#appendix) section.

## Usage

For the purpose of examples, we use `zustand` as the library. Any library that has a similar `getState` and `setState` api will work.

### Terminology:

I switched up the terminology compared to `redux` to make it explicit for code authors using this library that this is different from redux's functionality. Here are the new name equivalents -

| Name    | Meaning                                                  | Equivalent redux function |
| ------- | -------------------------------------------------------- | ------------------------- |
| `toss`  | A function used to toss actions                          | `dispatch`                |
| `taker` | A function that takes tossed actions and returns a state | `reducer`                 |

Consider the following code

```ts
// state.ts
import { create } from 'zustand';
import { make } from '@innu/state';
import type { MyActions, MyState } from './types.ts'; // Assume these are defined.

export const [attach] = make(
  create({
    //... define initial state here.
  })
);

export const [tossMain] = attach<MyState, MyActions>(async (getState, action, tossLocal) => {
  // ... async logic here to handle actions
});
```

Now, any actions of the type `MyActions` can be tossed using the `toss` function exported. As a bonus, you can use the `attach` function again to add additional reducers as well. All reducers will work on the same state object. For example :

```ts
import { attach, tossMain } from 'state.ts';
import { PopupActions, PopupState } from './page2.types.ts';

export const [tossPopup] = attach<PopupState, PopupActions>(async (getState, action, tossLocal) => {
  // ... page 2 logic here.
  await tossMain({
    // some `MyAction` object example: logging a user out
  });
  // ... some more logic
});
```

This solves a few problems I had with reducers, in my opinion -

1. Async logic does not need extra libraries
2. `toss` (`dispatch`) actions from within a reducer
   - this means orchestrating actions means adding just another action.
   - this makes it easier to have distinct user triggered actions and internal actions (example: keeping track of loading state of a network call is an internal action that a user never needs to dispatch)
3. Lazy-loaded modules can add their own slice after loading. (planned feature - removing the lazy loaded slice via a cleanup function)
4. Tracking orchestration between slices is simplified - it is now the same as seeing what files a given file imports `toss` functions from.

# Appendix

## Why did I make this?

### History

A while ago at my work we experimented with the question "what if reducers were async functions?" and we dug deep into all its problems and caveats. However, we did find the usage enjoyable and simple given we don't shoot ourselves in the foot with several foot-guns that it had. We abandoned that idea after a while but now I kept contemplating it further. This library is the result of that.

### Async reducers

Redux's reducers are thought to be "pure functions" from their mathematical origin. I think if we dig deep into how javascript ends up using those functions, there is a time delay between the start and end of the function. This is slightly different from mathematical definition of a pure function but it works for redux's purposes.

TODO - add more philosophy, history and reasoning
