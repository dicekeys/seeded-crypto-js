/// <reference types="emscripten" />

declare module "seeded-crypto-js" {

export enum PtrIntoSeededCryptoModule {_=0}

export type TypedByteArray = ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array
export type BindableToString = TypedByteArray | string
export type ByteArrayAsUrlSafeBase64String = string;

export interface ExplicitDelete {
    delete(): void; 
}

interface SealedCryptoSerializableObjectStatics<T> extends ExplicitDelete {
    fromJson(json: string): T;
    fromSerializedBinaryForm(serializedBinaryForm: TypedByteArray): T;
}

interface DerivedSecretStatics<T> extends SealedCryptoSerializableObjectStatics<T> {
    deriveFromSeed: (seedString: string, derivationOptionsJson: string) => T;
}

interface SealedCryptoSerializableObject extends ExplicitDelete {
    toCustomJson(indent: number, indentCharCode: number): string;
    toJson(): string;
    toSerializedBinaryForm(): TypedByteArray;
}

interface DerivedSecret extends SealedCryptoSerializableObject {
    readonly derivationOptionsJson: string;    
}

interface DerivedSecretJson {
    derivationOptionsJson: string;
}

interface StaticPackagedSealedmessage{
    new(ciphertext: TypedByteArray, derivationOptionsJson: string, unsealingInstructions: string): PackagedSealedMessage;
}

export interface PackagedSealedMessage extends SealedCryptoSerializableObject {
    readonly ciphertext: Uint8Array;
    readonly derivationOptionsJson: string;
    readonly unsealingInstructions: string;
}

export interface PackagedSealedMessageJson {
    ciphertext: ByteArrayAsUrlSafeBase64String;
    derivationOptionsJson: string;
    unsealingInstructions: string;
}

interface StaticSealingKey extends DerivedSecretStatics<SealingKey> {
}

export interface SealingKey extends DerivedSecret {
    readonly sealingKeyBytes: Uint8Array;
}

export interface SealingKeyJson extends DerivedSecretJson {
    publicKeyBytes: ByteArrayAsUrlSafeBase64String;
    seal(message: BindableToString, unsealingInstructions: string): PackagedSealedMessage;
    sealToCiphertextOnly(message: BindableToString, unsealingInstructions: string): Uint8Array;
}

interface StaticSecret extends DerivedSecretStatics<Secret> {
}

export interface Secret extends DerivedSecret {
    readonly secretBytes: Uint8Array;
}

export interface SecretJson extends DerivedSecretJson {
    secretBytes: ByteArrayAsUrlSafeBase64String;
}

interface StaticSignatureVerificationKey extends DerivedSecretStatics<SignatureVerificationKey> {}

export interface SignatureVerificationKey extends DerivedSecret {
    readonly signatureVerificationKeyBytes: Uint8Array;
    verify(message: BindableToString, signature: TypedByteArray): boolean;
}

export interface SignatureVerificationKeyJson extends DerivedSecretJson {
    signatureVerificationKeyBytes: ByteArrayAsUrlSafeBase64String;
}

interface StaticSigningKey extends DerivedSecretStatics<SigningKey> {
    generateSignature(message: BindableToString, seedString: string, derivationOptionsJson: string): Uint8Array;
}

export interface SigningKey extends Omit<DerivedSecret, "toCustomJson"> {
    readonly signingKeyBytes: Uint8Array;
    readonly signatureVerificationKeyBytes: Uint8Array;
    toCustomJson(
        minimizeSizeByRemovingTheSignatureVerificationKeyBytesWhichCanBeRegeneratedLater: boolean,
        indent: number,
        indentCharCode: number
    ): string;
    getSignatureVerificationKey(): SignatureVerificationKey;
    generateSignature(message: BindableToString): Uint8Array;
}

export interface SigningKeyJson extends DerivedSecretJson {
    signingKeyBytes: ByteArrayAsUrlSafeBase64String;
    signatureVerificationKeyBytes?: ByteArrayAsUrlSafeBase64String;
}

interface StaticSymmetricKey extends DerivedSecretStatics<SymmetricKey> {
    seal(message: BindableToString, unsealingInstructions: string, seedString: string, derivationOptions: string): PackagedSealedMessage;
    unseal(packagedSealedMessage: PackagedSealedMessage, seedString: string): Uint8Array;
    unsealJsonPackagedSealedMessage(jsonPackagedSealedMessage: string, seedString: string): Uint8Array;
    unsealBinaryPackagedSealedMessage(binaryPackagedSealedMessage: TypedByteArray, seedString: string): Uint8Array;
}

export interface SymmetricKey extends DerivedSecret {
    readonly keyBytes: Uint8Array;
    seal(message: BindableToString, unsealingInstructions: string): PackagedSealedMessage;
    sealToCiphertextOnly(message: BindableToString, unsealingInstructions: string): Uint8Array;
    unsealCiphertext(ciphertext: TypedByteArray, unsealingInstructions: string): Uint8Array;
    unseal(packagedSealedMessage: PackagedSealedMessage): Uint8Array;
    unsealJsonPackagedSealedMessage(jsonPackagedSealedMessage: string): Uint8Array;
    unsealBinaryPackagedSealedMessage(binaryPackagedSealedMessage: TypedByteArray): Uint8Array;
}

export interface SymmetricKeyJson extends DerivedSecretJson {
    keyBytes: ByteArrayAsUrlSafeBase64String;
}

interface StaticUnsealingKey extends DerivedSecretStatics<UnsealingKey> {
    unseal(packagedSealedMessage: PackagedSealedMessage, seedString: string): Uint8Array;
}

export interface UnsealingKey extends DerivedSecret {
    readonly privateKeyBytes: Uint8Array;
    readonly publicKeyBytes: Uint8Array;
    getSealingKey(): SealingKey;
    unsealCiphertext(ciphertext: TypedByteArray, unsealingInstructions: string): Uint8Array;
    unseal(packagedSealedMessage: PackagedSealedMessage): Uint8Array;
    unsealJsonPackagedSealedMessage(jsonPackagedSealedMessage: string): Uint8Array;
    unsealBinaryPackagedSealedMessage(binaryPackagedSealedMessage: TypedByteArray): Uint8Array;
}

export interface UnsealingKeyJson extends DerivedSecretJson {
    privateKeyBytes: ByteArrayAsUrlSafeBase64String;
    publicKeyBytes: ByteArrayAsUrlSafeBase64String;
}



export interface SeededCryptoModule extends EmscriptenModule {
    PackagedSealedMessage: StaticPackagedSealedmessage;
    SealingKey: StaticSealingKey;
    Secret: StaticSecret;
    SignatureVerificationKey: StaticSignatureVerificationKey;
    SigningKey: StaticSigningKey;
    SymmetricKey: StaticSymmetricKey;
    UnsealingKey: StaticUnsealingKey;
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
