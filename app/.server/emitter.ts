import EventEmitter from "node:events";
import TypedEventEmitter from "typed-emitter";

export type Events = {
  message: (chunk: string) => void;
  complete: (text: string) => void;
};

export const emitter = new EventEmitter() as TypedEventEmitter<Events>;
