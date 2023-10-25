import { it } from "vitest";

interface Events {
  click: {
    x: number;
    y: number;
  };
  focus: undefined;
  test: [number, string]
}


// export const sendEvent = (event: keyof Events, ...args: any[]) => {
type SendEventArgs<TEvent extends keyof Events> = Events[TEvent] extends {} ? [eventPayload: Events[TEvent]] : [];
export const sendEvent = <TEvent extends keyof Events>(event: TEvent, ...args: SendEventArgs<TEvent>) => {
  // Send the event somewhere!
};

it("Should force you to pass a second argument when you choose an event with a payload", () => {
  // @ts-expect-error
  sendEvent("click");

  sendEvent("click", {
    // @ts-expect-error
    x: "oh dear",
  });

  sendEvent(
    "click",
    // @ts-expect-error
    {
      y: 1,
    }
  );

  sendEvent("click", {
    x: 1,
    y: 2,
  });

  sendEvent("test", [123, "str"]);
});

it("Should prevent you from passing a second argument when you choose an event without a payload", () => {
  sendEvent("focus");

  sendEvent(
    "focus",
    // @ts-expect-error
    {}
  );
});
