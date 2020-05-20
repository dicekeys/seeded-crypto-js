
type ByteArrayAsUrlSafeBase64String = string;

declare class ExplicitDelete {
    delete(): void; 
}

declare class SealedCryptoSerializableObject<T extends SealedCryptoSerializableObject<T>> extends ExplicitDelete {
    fromJson(json: string): T;
    toJson(indent?: number, indentChar?: string): String;
    fromSerializedBinaryForm(serializedBinaryForm: ArrayBuffer): T;
    toSerializedBinaryForm(): ArrayBuffer;
}

declare class DerivedSecret<T extends DerivedSecret<T>> extends SealedCryptoSerializableObject<T> {
    static derive: (seed: string, derivationOptionsJson: string) => DerivedSecret<any>;
    readonly derivationOptionsJson: string;    
}

interface DerivedSecretJson {
    derivationOptionsJson: string;
}

declare class PackagedSealedMessage extends SealedCryptoSerializableObject<PackagedSealedMessage> {
    readonly ciphertext: ArrayBuffer;
    readonly derivationOptionsJson: string;
    readonly unsealingInstructions: string;
}

interface PackagedSealedMessageJson {
    ciphertext: ArrayBuffer;
    derivationOptionsJson: string;
    unsealingInstructions: string;
}

declare class SealingKey extends DerivedSecret<SealingKey> {
    static derive: (seed: string, derivationOptionsJson: string) => SealingKey;
    readonly publicKeyBytes: ArrayBuffer;
}

interface SealingKeyJson extends DerivedSecretJson {
    publicKeyBytes: ByteArrayAsUrlSafeBase64String;
}

declare class Secret extends DerivedSecret<Secret> {
    static derive: (seed: string, derivationOptionsJson: string) => Secret;
    readonly secretBytes: ArrayBuffer;
}

interface SecretJson extends DerivedSecretJson {
    secretBytes: ByteArrayAsUrlSafeBase64String;
}

declare class SignatureVerificationKey extends DerivedSecret<SignatureVerificationKey> {
    static derive: (seed: string, derivationOptionsJson: string) => SignatureVerificationKey;
    readonly signatureVerificationKeyBytes: ArrayBuffer;
}

interface SignatureVerificationKeyJson extends DerivedSecretJson {
    signatureVerificationKeyBytes: ByteArrayAsUrlSafeBase64String;
}

declare class SigningKey extends DerivedSecret<SigningKey> {
    static derive: (seed: string, derivationOptionsJson: string) => SigningKey;
    // FIXME -- how to handle special-case of toJson function?
    toJsonWithoutSignatureVerificaitonKeyBytes(indent?: number, indentChar?: string): String;
    readonly signingKeyBytes: ArrayBuffer;
    readonly signatureVerificationKeyBytes: ArrayBuffer;
}

interface SigningKeyJson extends DerivedSecretJson {
    signingKeyBytes: ByteArrayAsUrlSafeBase64String;
    signatureVerificationKeyBytes?: ByteArrayAsUrlSafeBase64String;
}

declare class SymmetricKey extends DerivedSecret<SymmetricKey> {
    static derive: (seed: string, derivationOptionsJson: string) => SymmetricKey;
    readonly keyBytes: ArrayBuffer
}

interface SymmetricKeyJson extends DerivedSecretJson {
    keyBytes: ByteArrayAsUrlSafeBase64String;
}

declare class UnsealingKey extends DerivedSecret<UnsealingKey> {
    static derive: (seed: string, derivationOptionsJson: string) => UnsealingKey;
    readonly privateKeyBytes: ArrayBuffer;
    readonly publicKeyBytes: ArrayBuffer;
}

interface UnsealingKeyJson extends DerivedSecretJson {
    privateKeyBytes: ByteArrayAsUrlSafeBase64String;
    publicKeyBytes: ByteArrayAsUrlSafeBase64String;
}
