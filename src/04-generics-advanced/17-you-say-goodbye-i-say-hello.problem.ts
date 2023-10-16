import { expect, it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";

type ResultGreeting<TGreeting> = TGreeting extends "goodbye" ? "hello" : "goodbye"
// function youSayGoodbyeISayHello(greeting: unknown) {
function youSayGoodbyeISayHello<TGreeting extends string>(greeting: TGreeting) {
  return (greeting === "goodbye" ? "hello" : "goodbye") as ResultGreeting<TGreeting>;
}

it("Should return goodbye when hello is passed in", () => {
  const result = youSayGoodbyeISayHello("hello");

  type test = [Expect<Equal<typeof result, "goodbye">>];

  expect(result).toEqual("goodbye");
});

it("Should return hello when goodbye is passed in", () => {
  const result = youSayGoodbyeISayHello("goodbye");

  type test = [Expect<Equal<typeof result, "hello">>];

  expect(result).toEqual("hello");
});
