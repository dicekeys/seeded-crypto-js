/// <reference types="emscripten" />

declare module "seeded-crypto-js" {

export enum PtrIntoSeededCryptoModule {_=0}

export type TypedByteArray = ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array
export type BindableToString = TypedByteArray | string
export type ByteArrayAsUrlSafeBase64String = string;

export class ExplicitDelete {
    delete(): void; 
}

export class SealedCryptoSerializableObjectStatics<T> extends ExplicitDelete {
    fromJson(json: string): T;
    fromSerializedBinaryForm(serializedBinaryForm: TypedByteArray): T;
}

export class DerivedSecretStatics<T> extends SealedCryptoSerializableObjectStatics<T> {
    deriveFromSeed: (seedString: string, derivationOptionsJson: string) => T;
}

export class SealedCryptoSerializableObject extends ExplicitDelete {
    toCustomJson(indent: number, indentCharCode: number): string;
    toJson(): string;
    toSerializedBinaryForm(): TypedByteArray;
}

export class DerivedSecret extends SealedCryptoSerializableObject {
    readonly derivationOptionsJson: string;    
}

export interface DerivedSecretJson {
    derivationOptionsJson: string;
}

export class PackagedSealedMessage extends SealedCryptoSerializableObject {
    readonly ciphertext: Uint8Array;
    readonly derivationOptionsJson: string;
    readonly unsealingInstructions: string;
    constructor(ciphertext: TypedByteArray, derivationOptionsJson: string, unsealingInstructions: string)
}

export interface PackagedSealedMessageJson {
    ciphertext: ByteArrayAsUrlSafeBase64String;
    derivationOptionsJson: string;
    unsealingInstructions: string;
}

export class SealingKey extends DerivedSecret {
    static deriveFromSeed: (seedString: string, derivationOptionsJson: string) => SealingKey;
    readonly publicKeyBytes: Uint8Array;
}

export interface SealingKeyJson extends DerivedSecretJson {
    publicKeyBytes: ByteArrayAsUrlSafeBase64String;
}

export class Secret extends DerivedSecret {
    static deriveFromSeed: (seedString: string, derivationOptionsJson: string) => Secret;
    readonly secretBytes: Uint8Array;
}

export interface SecretJson extends DerivedSecretJson {
    secretBytes: ByteArrayAsUrlSafeBase64String;
}

export class SignatureVerificationKey extends DerivedSecret {
    static deriveFromSeed: (seedString: string, derivationOptionsJson: string) => SignatureVerificationKey;
    readonly signatureVerificationKeyBytes: Uint8Array;
}

export interface SignatureVerificationKeyJson extends DerivedSecretJson {
    signatureVerificationKeyBytes: ByteArrayAsUrlSafeBase64String;
}

export class SigningKey extends DerivedSecret {
    static deriveFromSeed: (seedString: string, derivationOptionsJson: string) => SigningKey;
    // FIXME -- how to handle special-case of toJson function?
    toJsonWithoutSignatureVerificaitonKeyBytes(indent?: number, indentChar?: string): String;
    readonly signingKeyBytes: Uint8Array;
    readonly signatureVerificationKeyBytes: Uint8Array;
}

export interface SigningKeyJson extends DerivedSecretJson {
    signingKeyBytes: ByteArrayAsUrlSafeBase64String;
    signatureVerificationKeyBytes?: ByteArrayAsUrlSafeBase64String;
}

class StaticSymmetricKey extends DerivedSecretStatics<SymmetricKey> {
    unseal(packagedSealedMessage: PackagedSealedMessage, seedString: string): Uint8Array;
    unsealJsonPackagedSealedMessage(jsonPackagedSealedMessage: string, seedString: string): Uint8Array;
    unsealBinaryPackagedSealedMessage(binaryPackagedSealedMessage: TypedByteArray, seedString: string): Uint8Array;
}

export class SymmetricKey extends DerivedSecret {
    readonly keyBytes: Uint8Array;
    seal(message: BindableToString, unsealingInstructions: string): PackagedSealedMessage;
    unseal(packagedSealedMessage: PackagedSealedMessage): Uint8Array;
    unsealJsonPackagedSealedMessage(jsonPackagedSealedMessage: string): Uint8Array;
    unsealBinaryPackagedSealedMessage(binaryPackagedSealedMessage: TypedByteArray): Uint8Array;
}

export interface SymmetricKeyJson extends DerivedSecretJson {
    keyBytes: ByteArrayAsUrlSafeBase64String;
}

export class UnsealingKey extends DerivedSecret {
    static deriveFromSeed: (seedString: string, derivationOptionsJson: string) => UnsealingKey;
    readonly privateKeyBytes: Uint8Array;
    readonly publicKeyBytes: Uint8Array;
}

export interface UnsealingKeyJson extends DerivedSecretJson {
    privateKeyBytes: ByteArrayAsUrlSafeBase64String;
    publicKeyBytes: ByteArrayAsUrlSafeBase64String;
}



export interface SeededCryptoModule extends EmscriptenModule {
    PackagedSealedMessage: new () => PackagedSealedMessage | SealedCryptoSerializableObjectStatics<PackagedSealedMessage>;
    SymmetricKey: (new () => SymmetricKey) & StaticSymmetricKey;
}

// Emscripten promises are kinda like promises... but it's important that we
// not get lulled into thinking they're actually promises.
// https://github.com/emscripten-core/emscripten/issues/5820
interface SeededCryptoModuleNotReallyAPromise {
    then: (fn: (SeededCrypto: SeededCryptoModule) => any) => void
}

// Mirroring the last line of the .js file generated by emscripten in es6 mode
const Module: () => SeededCryptoModuleNotReallyAPromise;
export default Module;


}
