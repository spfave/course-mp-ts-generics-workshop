import { Equal, Expect } from "../helpers/type-utils";

// Function expression syntax
const returnWhatIPassIn = <T>(t: T) => {
  return t;
};

// Function declaration syntax
function returnWhatIPassIn2<T>(t:T) {
  return t;
}

const one = returnWhatIPassIn(1);
const matt = returnWhatIPassIn("matt");

type tests = [Expect<Equal<typeof one, 1>>, Expect<Equal<typeof matt, "matt">>];
