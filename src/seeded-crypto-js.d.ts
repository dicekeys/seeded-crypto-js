declare module "seeded-crypto-js" {

type TypedByteArray = ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array
type BindableToString = TypedByteArray | string
type ByteArrayAsUrlSafeBase64String = string;

class ExplicitDelete {
    delete(): void; 
}

class SealedCryptoSerializableObject<T extends SealedCryptoSerializableObject<T>> extends ExplicitDelete {
    fromJson(json: string): T;
    toJson(indent?: number, indentChar?: string): string;
    fromSerializedBinaryForm(serializedBinaryForm: TypedByteArray): T;
    toSerializedBinaryForm(): TypedByteArray;
}

class DerivedSecret<T extends DerivedSecret<T>> extends SealedCryptoSerializableObject<T> {
    static derive: (seed: string, derivationOptionsJson: string) => DerivedSecret<any>;
    readonly derivationOptionsJson: string;    
}

interface DerivedSecretJson {
    derivationOptionsJson: string;
}

class PackagedSealedMessage extends SealedCryptoSerializableObject<PackagedSealedMessage> {
    readonly ciphertext: Uint8Array;
    readonly derivationOptionsJson: string;
    readonly unsealingInstructions: string;
    constructor(ciphertext: TypedByteArray, derivationOptionsJson: string, unsealingInstructions: string)
}

interface PackagedSealedMessageJson {
    ciphertext: ByteArrayAsUrlSafeBase64String;
    derivationOptionsJson: string;
    unsealingInstructions: string;
}

class SealingKey extends DerivedSecret<SealingKey> {
    static derive: (seed: string, derivationOptionsJson: string) => SealingKey;
    readonly publicKeyBytes: Uint8Array;
}

interface SealingKeyJson extends DerivedSecretJson {
    publicKeyBytes: ByteArrayAsUrlSafeBase64String;
}

class Secret extends DerivedSecret<Secret> {
    static derive: (seed: string, derivationOptionsJson: string) => Secret;
    readonly secretBytes: Uint8Array;
}

interface SecretJson extends DerivedSecretJson {
    secretBytes: ByteArrayAsUrlSafeBase64String;
}

class SignatureVerificationKey extends DerivedSecret<SignatureVerificationKey> {
    static derive: (seed: string, derivationOptionsJson: string) => SignatureVerificationKey;
    readonly signatureVerificationKeyBytes: Uint8Array;
}

interface SignatureVerificationKeyJson extends DerivedSecretJson {
    signatureVerificationKeyBytes: ByteArrayAsUrlSafeBase64String;
}

class SigningKey extends DerivedSecret<SigningKey> {
    static derive: (seed: string, derivationOptionsJson: string) => SigningKey;
    // FIXME -- how to handle special-case of toJson function?
    toJsonWithoutSignatureVerificaitonKeyBytes(indent?: number, indentChar?: string): String;
    readonly signingKeyBytes: Uint8Array;
    readonly signatureVerificationKeyBytes: Uint8Array;
}

interface SigningKeyJson extends DerivedSecretJson {
    signingKeyBytes: ByteArrayAsUrlSafeBase64String;
    signatureVerificationKeyBytes?: ByteArrayAsUrlSafeBase64String;
}

class SymmetricKey extends DerivedSecret<SymmetricKey> {
    static derive: (seed: string, derivationOptionsJson: string) => SymmetricKey;
    readonly keyBytes: Uint8Array
}

interface SymmetricKeyJson extends DerivedSecretJson {
    keyBytes: ByteArrayAsUrlSafeBase64String;
}

class UnsealingKey extends DerivedSecret<UnsealingKey> {
    static derive: (seed: string, derivationOptionsJson: string) => UnsealingKey;
    readonly privateKeyBytes: Uint8Array;
    readonly publicKeyBytes: Uint8Array;
}

interface UnsealingKeyJson extends DerivedSecretJson {
    privateKeyBytes: ByteArrayAsUrlSafeBase64String;
    publicKeyBytes: ByteArrayAsUrlSafeBase64String;
}


}
