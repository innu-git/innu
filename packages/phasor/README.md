Certainly! Here's an improved version of your README.md:

---

# @innu/phasor

This library facilitates the management of asynchronous operations as state machine objects. It is particularly useful for representing the state of network calls or any asynchronous operation's progress as an object.

## Phasor State Machine

![Phasor state machine](./docs/state-diagram.excalidraw.png)

1. A phasor is initially at the `rest` state until it has been acted upon for the first time.
2. Once acted upon, the phasor transitions to the `run` state.
3. After the operation is complete, the phasor enters the `done` state.
4. Subsequently, the phasor can enter the `rerun` state, either to redo the operation with new inputs or to retry in case of errors.

## Usage

The primary export of this library consists of types. To illustrate, consider representing a network call made to fetch search results based on a search string. This is how you would model it as a Phasor -

```typescript
import { Phase, Result } from '@innu/phasor';
import { SearchResult, SearchErrors } from './types.ts'; // assuming this exists

type SearchResultPhasor = Phasor<string, Result<SearchResult[], SearchErrors>>;
```

Here, `Phasor` is a [discriminated union](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions) with `phase` as the discriminant. Consequently, `SearchResultPhasor` becomes a strongly typed entity that must be checked before access.
You can initialize an object like this -

```typescript
let searchResult: SearchResultPhasor = {
  phase: Phase.Rest,
};
```

Alternatively, you can utilize the factory class included in the library -

```typescript
import { ph } from '@innu/phasor';

let searchResult: SearchResultPhasor = ph.rest();
```

Now, you can update the `searchResult` object as your search operation progresses through different stages.

```typescript
// When search is initiated
searchResult = ph.run(searchInput);

// When search completes successfully
searchResult = ph.done(searchInput, response);
```

This library also offers type guards for convenience -

```typescript
if (ph.is.done(searchResult)) {
  console.log(searchResult.result);
}
```

Moreover, the library includes a `Result` type to specify either `Ok` or `Err` type values, with a similar API -

```typescript
let otherResult = ph.done(input, res.ok(result));
// or
otherResult = ph.done(input, res.err(new Error('Oops')));
```

This library is utilized in `@innu/state`. [Learn more here](../state/README.md).

--- 

This revised version provides clearer explanations, improves readability, and includes syntax highlighting for code snippets.
