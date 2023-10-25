import { expect, it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";

// function runGenerator(generator: unknown) {
  
type TFunc = () => string;
// Union
// function runGenerator(generator: TFunc | { run: TFunc }) {
  
// Function overload
// Note: function overloads are at their best when you have a different return type based on something that you pass in
function runGenerator(generator: TFunc): ReturnType<TFunc>;
function runGenerator(generator: { run: TFunc }): ReturnType<TFunc>;
function runGenerator(generator: TFunc | { run: TFunc }) {
  if (typeof generator === "function") {
    return generator();
  }
  return generator.run();
}

it("Should accept an object where the generator is a function", () => {
  const result = runGenerator({
    run: () => "hello",
  });

  expect(result).toBe("hello");

  type test1 = Expect<Equal<typeof result, string>>;
});

it("Should accept an object where the generator is a function", () => {
  const result = runGenerator(() => "hello");

  expect(result).toBe("hello");

  type test1 = Expect<Equal<typeof result, string>>;
});
