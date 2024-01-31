import { describe, expect, test } from "vitest";
import { formatCounterDisplayValue } from "../helpers";

describe("formatCounterDisplayValue", () => {
  test.each([
    [0, "0"],
    [120, "120"],
    [1105, "1.1k"],
    [127656, "128k"],
    [12345, "12.3k"],
    [1231232132132, "1231232132k"],
  ])("with input of %p should return %p", (input, expectedResult) => {
    const result = formatCounterDisplayValue(input);
    expect(result).toEqual(expectedResult);
  });
});
