import { INTENT } from "~/lib/ResourceBuilder";

interface IntentProps<T> {
  value: T;
}

export function Intent<T extends string = string>({ value }: IntentProps<T>) {
  return <input name={INTENT} value={value} type="hidden" />;
}
