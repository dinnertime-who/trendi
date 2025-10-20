import { parseAsString } from "nuqs";

export const defaultStringParser = (defaultValue: string = "") => {
  return parseAsString
    .withDefault(defaultValue)
    .withOptions({ clearOnDefault: true });
};
