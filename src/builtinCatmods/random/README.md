# random
This module contains handy functions for generating something random.

## Basic methods

### `random(x)`
Returns a random float value between 0 and x, exclusive.

### `random.dice(dice1,dice2,...diceN)`
Returns a random given argument.
When given just one string value, the string will be split by `,` separator and a random item will be returned.

### `random.range(x1, x2)`
Returns a random float value between `x1` and `x2`, exclusive.

### `random.deg()`
Returns a random float value between 0 and 360, exclusive.

### `random.coord()`
Returns a pair of random coordinates from 0 to a corresponding room side.

### `random.chance(x[, y])`
When given both `x` and `y`, randomly returns `true` approximately `x` times out of `y`. When given only a value between 0…100, returns `true` approximately `x` times out of 100. E.g. `random.chance(30)` means a 30% success rate.

### `random.text(inputText)`

This function randomizes text inside `{` `}` curly braces, with tokens inside `{` `}` separated by a `|` symbol. Curly braces can be nested. The method is useful for randomizing text for, say, NPC characters or for generating items' descriptions.

Example:

```js
console.log(random.text('a very {very |}tasty {{beef |chicken |}sausage|carrot}'));
```

This will alternate between a very and very-very tasty sausages and carrots.

## Seeded random

`random` has an initialized seeded random number generator that is persistent across systems and game runs, and also allows creating new random number generators that won't affect the global one. They all use Mulberry32 under the hood.

### `random.seeded()`

Returns next seeded random number.

### `random.setSeed(seed)`

Sets the seed of the `random.seeded()` method.

### `random.createSeededRandomizer(startingSeed)`

Creates a new seeded random number generator. It is a function that you can store and use in the same way as `random.seeded()`:

```js
this.randomizer = random.createSeededRandomizer(456852);
// Will output the same numbers on each run
console.log(this.randomizer());
console.log(this.randomizer());
console.log(this.randomizer());
```

## Non-uniform distribution

### `random.histogram(...histogram)`

Returns a weighted random number from 0 to 1 according to a given histogram of frequency.
Each argument defines the probability of a random value to appear in a bucket.
Values are uniformly distributed inside each bucket, but overall distribution
depends on your histogram.

**Examples:**

```js
// Two arguments create two buckets with ranges [0;0.5) and [0.5;1).
// The first bucket has a weight of 1, the second one has a weight of 10.
// This returns values in a range [0.5;1) ten times more often than in [0;0.5).
console.log(random.histogram(1, 10));
```
```js
// Three arguments make buckets [0;0.333), [0.333;0.667), and [0.667;1).
// The method will return values in the range [0.333;0.667) ten times more often
// than in the range [0;0.333) and five times more often than in the range [0.667;1).
console.log(random.histogram(1, 10, 2));
```
```js
// Four buckets: [0;0.25), [0.25;0.5), [0.5;0.75), and [0.75;1).
// Because two of the buckets have 0 probability to return a value,
// you will only get values between [0;0.25) and [0.75;1).
console.log(random.histogram(1, 0, 0, 1))
```

### `random.optimistic(exp)`

Returns a random value from 0 to 1 that tends to be close to 1.
`exp` is an optional value that sets the power of the effect.
This value should be larger than 1, and equals to 2 by default.

### `random.pessimistic(exp)`

Returns a random value from 0 to 1 that tends to be close to 0.
`exp` is an optional value that sets the power of the effect.
This value should be larger than 1, and equals to 2 by default.
