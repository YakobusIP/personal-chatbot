import { EventEmitter } from "events";

const globalForEmitter = globalThis as unknown as { emitter: EventEmitter };

export const eventEmitter = globalForEmitter.emitter || new EventEmitter();

if (process.env.NODE_ENV !== "production")
  globalForEmitter.emitter = eventEmitter;
