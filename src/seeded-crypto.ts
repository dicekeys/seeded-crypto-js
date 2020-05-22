import SeededCryptoModuleNotReallyAPromiseFn from "seeded-crypto-js";
import {
  SeededCryptoModule,
  PtrIntoSeededCryptoModule
} from "seeded-crypto-js";
import {
  getWebAsmModulePromiseWithAugmentedTypes,
  TypedMemoryHelpersForEmscriptenModule
} from "./should-be-modules/typed-webasm-module-memory-helpers"

export * from "seeded-crypto-js";

export type SeededCryptoModuleWithHelpers = SeededCryptoModule &
  TypedMemoryHelpersForEmscriptenModule<PtrIntoSeededCryptoModule>;

/**
 * Return a promise to a a web assembly module with our TypeScript helpers for allocating
 * memory within the web assembly memory space.
 */
export const SeededCryptoModulePromise: Promise<SeededCryptoModuleWithHelpers> =
  getWebAsmModulePromiseWithAugmentedTypes(SeededCryptoModuleNotReallyAPromiseFn)