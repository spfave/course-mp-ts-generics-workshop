import { expect, it } from "vitest";

type GetParamKeys<TTranslation extends string> = TTranslation extends ""
  ? []
  : TTranslation extends `${string}{${infer Param}}${infer Tail}`
  ? [Param, ...GetParamKeys<Tail>]
  : [];
type test1 = GetParamKeys<(typeof translations)["button"]>;
type test2 = GetParamKeys<(typeof translations)["intro"]>;
type test3 = GetParamKeys<(typeof translations)["intro"]>[number];

const translate = <
  TTranslation extends Record<string, string>, 
  TKey extends keyof TTranslation,
  TParamKeys extends string[] = GetParamKeys<TTranslation[TKey]>,
>(
  translations: TTranslation, 
  key: TKey, 
  // ...args: GetParamKeys<TTranslation[TKey]> extends [] // builds without need for 3rd generic
  //   ? []
  //   : [params: Record<GetParamKeys<TTranslation[TKey]>[number], string>]
  ...args: TParamKeys extends [] // uses 3rd generic, reduces TS computation
    ? []
    : [params: Record<TParamKeys[number], string>]
) => {
  const translation = translations[key];
  const params: any = args[0] || {};

  return translation.replace(/{(\w+)}/g, (_, key) => params[key]);
};

// TESTS

const translations = {
  title: "Hello, {name}!",
  subtitle: "You have {count} unread messages.",
  button: "Click me!",
  intro: "Hi my name is {name} and I'm from {place}",
} as const;
translate(translations, "intro", { name: "Seb", place: "VA" });

it("Should translate a translation without parameters", () => {
  const buttonText = translate(translations, "button");

  expect(buttonText).toEqual("Click me!");
});

it("Should translate a translation WITH parameters", () => {
  const subtitle = translate(translations, "subtitle", {
    count: "2",
  });

  expect(subtitle).toEqual("You have 2 unread messages.");
});

it("Should force you to provide parameters if required", () => {
  // @ts-expect-error
  translate(translations, "title");
});

it("Should not let you pass parameters if NOT required", () => {
  // @ts-expect-error
  translate(translations, "button", {});
});
