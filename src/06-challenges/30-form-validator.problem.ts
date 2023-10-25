import { expect, it } from "vitest";
import { Equal, Expect } from "../helpers/type-utils";

// const makeFormValidatorFactory = (validators: unknown) => (config: unknown) => {
//   return (values: unknown) => {
//     const errors = {} as any;

//     for (const key in config) {
//       for (const validator of config[key]) {
//         const error = validators[validator](values[key]);
//         if (error) {
//           errors[key] = error;
//           break;
//         }
//       }
//     }

//     return errors;
//   };
// };

// Enforces validation function input is of type string
const makeFormValidatorFactory1 = 
  <TValidatorKeys extends string>(validators: Record<TValidatorKeys, (value: string) => string | void>) => 
  <TCfgKeys extends string>(config: Record<TCfgKeys, Array<TValidatorKeys>>) => {
    return (values: Record<TCfgKeys, string>) => {
      const errors = {} as Record<TCfgKeys, string | undefined>;

      for (const key in config) {
        for (const validator of config[key]) {
          const error = validators[validator](values[key]);
          if (error) {
            errors[key] = error;
            break;
          }
        }
      }

      return errors;
    };
  };

// Allows for capturing value input type of validation functions
const makeFormValidatorFactory = 
  <TValidators extends Record<string, (value: any) => string | void>>(validators: TValidators) => 
  <TConfig extends Record<string, Array<keyof TValidators>>>(config: TConfig) => {
    return (values: {[key in keyof TConfig]: Parameters<TValidators[TConfig[key][0]]>[0]}) => {
      const errors = {} as Record<keyof TConfig, string | undefined>;

      for (const key in config) {
        for (const validator of config[key]) {
          const error = validators[validator](values[key]);
          if (error) {
            errors[key] = error;
            break;
          }
        }
      }

      return errors;
    };
  };

const createFormValidator = makeFormValidatorFactory({
  required: (value: string) => {
    if (value === "") {
      return "Required";
    }
  },
  minLength: (value: string) => {
    if (value.length < 5) {
      return "Minimum length is 5";
    }
  },
  email: (value: string) => {
    if (!value.includes("@")) {
      return "Invalid email";
    }
  },
  adult: (value: number) => { // testing for different value type
    if (value < 18) {
      return "Not an adult";
    }
  }
});

const validateUser = createFormValidator({
  id: ["required"],
  username: ["required", "minLength"],
  email: ["required", "email"],
  age: ["adult"],
});

it("Should properly validate a user", () => {
  const errors = validateUser({
    id: "1",
    username: "john",
    email: "Blah",
    age: 15,
  });

  expect(errors).toEqual({
    username: "Minimum length is 5",
    email: "Invalid email",
  });

  type test = Expect<
    Equal<
      typeof errors,
      {
        id: string | undefined;
        username: string | undefined;
        email: string | undefined;
        age: string | undefined;
      }
    >
  >;
});

it("Should not allow you to specify a validator that does not exist", () => {
  createFormValidator({
    // @ts-expect-error
    id: ["i-do-not-exist"],
  });
});

it("Should not allow you to validate an object property that does not exist", () => {
  const validator = createFormValidator({
    id: ["required"],
  });

  validator({
    // @ts-expect-error
    name: "123",
  });
});
