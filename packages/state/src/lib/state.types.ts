export type Maybe<T> = T | undefined | void;
export type Awaitable<T> = T | PromiseLike<T>;
export type MaybeAwaitable<T> = Maybe<T> | Awaitable<Maybe<T>>;
export type Cause<Action> = (action: Action) => MaybeAwaitable<void>;
export type GetState<State> = () => State;

export type Effect<State, Action> = (
  getState: GetState<State>,
  action: Action,
  cause: Cause<Action>
) => MaybeAwaitable<Partial<State>>;

export type StateManager<State> = {
  getState: GetState<State>;
  setState: (state: Partial<State>) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EffectActions<E> = E extends Effect<any, infer A> ? A : never;
