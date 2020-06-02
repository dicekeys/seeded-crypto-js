/// <reference types="emscripten" />
const SeededCryptoModuleNotReallyAPromiseFn = require("./seeded-crypto-js");
import {
  getWebAsmModulePromiseWithAugmentedTypes,
  TypedMemoryHelpersForEmscriptenModule
} from  "@dicekeys/webasm-module-memory-helper"
import { SerializationType } from "child_process";


/**
 * The subset of [[DerivationOptions]] specific to hash functions designed to be computionally expensive
 * and consume memory in order to slow brute-force guessing attacks, including
 * those attacks that might utilize speically-designed hardware.
 * 
 * @category DerivationOptions
 */
export interface DerivationOptionsForExpensiveHashFunctions {
    hashFunction: "Argon2id" | "Scrypt";
    /**
     * The  amount of memory that Argoin2id or Scrypt
     * will be required to iterate (pass) through in order to compute the correct output.
     * 
     * As the name implies, the hashFunctionMemoryLimitInBytes field is specified in bytes.
     * It should be a multiple of 1,024, must be at least 8,192
     * and no greater than 2^31 (2,147,483,648).
     * The default is 67,108,864.
     * This field maps to the memlimit parameter in libsodium.
     */
    hashFunctionMemoryLimitInBytes?: number;
  
    /**
     * The number of passes that Argoin2id or Scrypt will need to make through that
     * memory to compute the hash.
     * 
     * The hashFunctionMemoryPasses must be at least 1, no greater than 2^32-1 (4,294,967,295),
     * and is set to 2 memory passes by default.
     * 
     * Since this parameter determines the number of
     * passes the hash function will make through the memory region specified by
     * [[hashFunctionMemoryLimitInBytes]], and results in hashing an amount of memory equal
     * to the product of these two parameters, the computational cost on the order of the
     * product of [[hashFunctionMemoryPasses]] times [[hashFunctionMemoryLimitInBytes]].
     * 
     * (The hashFunctionMemoryPasses field maps to the poorly-documented opslimit in libsodium.
     * An examination of the libsodium source shows that opslimit is assigned to a parameter
     * named t_cost, which in turn is assigned to instance.passes on line 56 of argon2.c.)
     */
    hashFunctionMemoryPasses?: number;
  }

  interface DerivationOptionsFor {
    type?: "Secret" | "SigningKey" | "SymmetricKey" | "UnsealingKey";
    /**
     * The cryptographic hash function used to derive an object
     * from a secret seed string.
     */
    hashFunction?: "Argon2id" | "Scrypt" | "BLAKE2b" | "SHA256";
  }
  
  /**
   * The subset of [[DerivationOptions]] specific to a [[Secret]].
   * 
   * @category DerivationOptions
   */
  export interface DerivationOptionsForSecret extends DerivationOptionsFor {
    /**
     * Setting this optional value ensures these options can only be used to
     * derive a [[Secret]], and not any other type of derived object.
     */
    type?: "Secret";
    /**
     * The length of the secret to be derived, in bytes.  If not set,
     * 32 bytes are derived.
     */
    lengthInBytes?: number;
  };
  
  /**
   * The subset of [[DerivationOptions]] specific to a [[SymmetricKey]].
   * 
   * @category DerivationOptions
   */
  export interface DerivationOptionsforSymmetricKey extends DerivationOptionsFor {
    /**
     * Setting this optional value ensures these options can only be used to
     * derive a [[SymmetricKey]], and not any other type of derived object.
     */
    type?: "SymmetricKey";
    /**
     * The algorithm to use for the underlying key and cryptographic algorithms.
     * (leave empty to use the default.)
     */
    algorithm?: "XSalsa20Poly1305";
  };
  
  /**
   * The subset of [[DerivationOptions]] specific to an [[UnsealingKey]].
   * 
   * @category DerivationOptions
   */
  export interface DerivationOptionsForUnsealingKey extends DerivationOptionsFor {
    /**
     * Setting this optional value ensures these options can only be used to
     * derive a [[UnsealingKey]] and its corresponding [[SealingKey]],
     * and not any other type of derived object.
     */
    type?: "UnsealingKey";
    /**
     * The algorithm to use for the underlying key and cryptographic algorithms.
     * (leave empty to use the default.)
     */
    algorithm?: "X25519";
  };
  
  /**
   * The subset of [[DerivationOptions]] specific to a [[SigningKey]].
   * 
   * @category DerivationOptions
   */
  export interface DerivationOptionsForSigningKey extends DerivationOptionsFor {
    /**
     * Setting this optional value ensures these options can only be used to
     * derive a [[SigningKey]] and its corresponding [[SignatureVerificationKey]],
     * and not any other type of derived object.
     */
    type?: "SigningKey";
    /**
     * The algorithm to use for the underlying key and cryptographic algorithms.
     * (leave empty to use the default.)
     */
    algorithm?: "Ed25519";
  };
  
  
  /**
   * The DerivationOptions used by the Seeded Crypto library
   * and which implement the portion of the
   * [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
   * that are interpreted by this library.
   * 
   * (Other options may appear in layers above that library.)
   * 
   * @category DerivationOptions
   */
  export type DerivationOptions = (
    DerivationOptionsForSecret |
    DerivationOptionsforSymmetricKey |
    DerivationOptionsForUnsealingKey |
    DerivationOptionsForSigningKey
  ) & (
    DerivationOptionsForExpensiveHashFunctions |
    {}
  ) ;
  


/**
 * This typing exists to ensure that pointers from other webassembly modules
 * are not accidentally passed into this webassembly module.
 * 
 * @category Parameter Passing
 */
enum PtrIntoSeededCryptoModule {_=0}

/**
 * The types of objects that can be converted into C++ byte arrays.
 * 
 * @category Parameter Passing
 */
export type ByteArray = ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array
/**
 * The types of objects that can be passed into operations that take
 * either a UTF8 string or a byte array.
 * 
 * @category Parameter Passing
 */
export type ByteArrayOrString = ArrayBuffer | Uint8Array | Uint8ClampedArray | Int8Array | string

/**
 * A string that contains a binary object encoded using 
 * encoded to URL-safe Base64 per
 * [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
 * 
 * @category JSON Serialization Format
 */
export type ByteArrayAsUrlSafeBase64String = string;

interface ExplicitDelete {
    /**
     * Deletes the underlying c++ data structures from the webassembly module's memory.
     * 
     * It is important to delete objects to prevent memory leaks.
     */
    delete(): void; 
}

interface SeededCryptoSerializableObjectStatics<T> {
    /**
     * Reconstitute this class from its serialized JSON format.
     * @param json The serialized JSON format of this class generated by calling
     * toJson() or toCustomJson() on a prior instance of this class.
     * 
    * **You must delete the reconstituted object manually** by calling [[delete]] to
    * avoid memory leaks, as it is stored within the WebAssembly module
    * and is not automatically garbage collected by the JavaScript runtime.
     * 
     * @returns The reconstituted object, which **you must delete manually** by
     * calling its [[delete]] method to avoid memory leaks.  That's because
     * derived objects are stored within the WebAssembly module
     * and are not automatically garbage collected by the JavaScript runtime.
     */
    fromJson(json: string): T;
    /**
     * Reconstitute this class from its serialized binary (byte array)
     * format.
     * @param serializedBinaryForm The serialized binary format of this class
     * generated by a toSeralizedBinaryForm() on a prior instance of this class.
     * 
     * @returns The reconstituted object, which **you must delete manually** by
     * calling its [[delete]] method to avoid memory leaks.  That's because
     * derived objects are stored within the WebAssembly module
     * and are not automatically garbage collected by the JavaScript runtime.
     */
    fromSerializedBinaryForm(serializedBinaryForm: ByteArray): T;
}
interface DerivableFromSeed<T> extends SeededCryptoSerializableObjectStatics<T> {
    /**
     * Derive this object from a seed string and a set of derivation options.
     * 
     * @param seedString The secret seed, such as a password, DiceKey, or
     * key stored elsewhere.
     * @param derivationOptionsJson Derivation options specified using the
     * [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
     * 
     * @returns The derived object, which **you must delete manually** by
     * calling its [[delete]] method to avoid memory leaks.  That's because
     * derived objects are stored within the WebAssembly module
     * and are not automatically garbage collected by the JavaScript runtime.
     *
     */
    deriveFromSeed(seedString: string, derivationOptionsJson: string): T;
}

interface SeededCryptoSerializableObject extends ExplicitDelete {
    /**
     * Serialize this object into JSON format using custom indentation.
     * 
     * @param indent The number of characters to indent
     * @param indentCharCode The unicode char code to indent, which you
     * can generate by creating a one-character string followed by
     * `.charCodeAt(0)`. For tabs, that would be `"\t".charCodeAt(0).` 
     * @returns This object in JSON format.
     */
    toCustomJson(indent: number, indentCharCode: number): string;
    /**
     * Serialize this object into JSON format.
     * @returns This object in JSON format.
     */
    toJson(): string;
    /**
     * Serialize this object into a binary format, which is
     * returned as a byte array.
     * @returns This object serialized into a byte array.
     */
    toSerializedBinaryForm(): Uint8Array;
}

interface DerivedSecret extends SeededCryptoSerializableObject {
    /**
     * The `derivationOptionsJson` passed as the second parameter to
     * `deriveFromSeed()` when this object was first derived from a
     * a secret seed.  Uses
     * [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
     */
    readonly derivationOptionsJson: string;    
}

interface DerivedSecretJson {
    /**
     * The options used to derive a secret or key, specified using the
     * [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
     */
    derivationOptionsJson: string;
}




/**
 * Sealing methods common to both SymmetricKey and SealingKey
 */
interface Sealing {
    /**
     * Seal a plaintext message
     * 
     * @param message The plaintext message to seal
     * @param unsealingInstructions If this optional string is
     * passed, the same string must be passed to unseal the message.
     * @return const std::vector<unsigned char> 
     */
    sealToCiphertextOnlyWithInstructions(message: ByteArrayOrString, unsealingInstructions: string): Uint8Array;

    /**
     * Seal a plaintext message
     * 
     * @param message The plaintext message to seal
     * @return A PackageSealedMessage containing the sealed ciphertext and the derivation options
     * (in plaintext) needed to (re)derive the key to unseal the ciphertext. (Since no
     * unsealing instructions are provided, that field will be empty.)
     */
    seal(message: ByteArrayOrString): PackagedSealedMessage;

    /**
     * Seal a plaintext message
     * 
     * @param message The plaintext message to seal
     * @param unsealingInstructions Instructions to be shared with the party unsealing this message
     * in plaintext, which may determine whether they will be willing to unseal the message and
     * for whom.  The instructions will be packaged along with the sealed message, but will be
     * stored in plaintext and readable by anyone with a copy of the resulting PackagedSealedMessage.
     * @return A PackageSealedMessage containing the sealed ciphertext, the derivation options
     * (in plaintext) needed to (re)derive the key to unseal the ciphertext, and the
     * unsealingInstructions (also in plaintext).
     */
    sealWithInstructions(message: ByteArrayOrString, unsealingInstructions: string): PackagedSealedMessage;

    /**
     * Seal a plaintext message
     * 
     * @param message The plaintext message to seal
     * @return The sealed ciphertext as a byte array only, without a copy of the
     * derivation options needed to re-derive the key to unseal the message.
     */
    sealToCiphertextOnly(message: ByteArrayOrString): Uint8Array;
    /**
     * Seal a plaintext message
     * 
     * @param message The plaintext message to seal
     * @param unsealingInstructions If this optional string is
     * passed, the same string must be passed to unseal the message.
     * @return The sealed ciphertext as a byte array only, without a copy of the
     * derivation options needed to re-derive the key to unseal the message or
     * the unsealing instructions needed for unsealing.
     */
    sealToCiphertextOnlyWithInstructions(message: ByteArrayOrString, unsealingInstructions: string): Uint8Array;
}

/**
 * Unsealing methods common to both SymmetricKey and UnsealingKey
 */
interface Unsealing {
  /**
   * Unseal a previously-sealed ciphertext: decrypting it, verifying that the
   * message hasn't been modified*, and that, if any unsealingInstructions were been
   * provided when the message was sealed, they also haven't changed. 
   * 
   * *The integrity check can prevent modifications of the ciphertext from being
   * undetected, but cannot detect if an attacker replaces the message with a
   * valid previously-sealed message.
   * 
   * @param ciphertext The sealed message to be unsealed.
   * @param unsealingInstructions If this optional value was
   * set during the `seal` operation, the same value must
   * be provided to unseal the message or the operation will fail.
   * 
   * @return A byte array containing the unsealed message. If the sealed message
   * was a string, the caller will need to decode it from UTF8 format.
   * 
   * @exception CryptographicVerificationFailureException thrown if the ciphertext
   * is not valid and cannot be unsealed.
   */
    unsealCiphertext(ciphertext: ByteArray, unsealingInstructions: string): Uint8Array;

    /**
     * Unseal a message that was previously sealed into a [[PackagedSealedMessage]] format:
     * decrypting it, verifying that the
     * message hasn't been modified*, and that, if any unsealingInstructions were been
     * provided when the message was sealed, they also haven't changed. 
     * 
     * *The integrity check can prevent modifications of the ciphertext from being
     * undetected, but cannot detect if an attacker replaces the message with a
     * valid previously-sealed message.
     * 
     * @param packagedSealedMessage The packaged messsage to unseal.
     * @return A byte array containing the unsealed message. If the sealed message
     * was a string, the caller will need to decode it from UTF8 format.
     * 
     * @exception CryptographicVerificationFailureException thrown if the ciphertext
     * is not valid and cannot be unsealed.
     */
    unseal(packagedSealedMessage: PackagedSealedMessage): Uint8Array;
    /**
     * Unseal a message that was previously sealed into a [[PackagedSealedMessage]] and
     * coverted to JSON format: restoring it from JSON format, decrypting it, verifying that the
     * message hasn't been modified*, and that, if any unsealingInstructions were been
     * provided when the message was sealed, they also haven't changed. 
     * 
     * *The integrity check can prevent modifications of the ciphertext from being
     * undetected, but cannot detect if an attacker replaces the message with a
     * valid previously-sealed message.
     * 
     * @param jsonPackagedSealedMessage The packaged messsage to unseal in JSON format.
     * @return A byte array containing the unsealed message. If the sealed message
     * was a string, the caller will need to decode it from UTF8 format.
     * 
     * @exception CryptographicVerificationFailureException thrown if the ciphertext
     * is not valid and cannot be unsealed.
     */
    unsealJsonPackagedSealedMessage(jsonPackagedSealedMessage: string): Uint8Array;
    /**
     * Unseal a message that was previously sealed into a [[PackagedSealedMessage]] and
     * coverted to binary format: restoring it from a byte array, decrypting it, verifying that the
     * message hasn't been modified*, and that, if any unsealingInstructions were been
     * provided when the message was sealed, they also haven't changed. 
     * 
     * *The integrity check can prevent modifications of the ciphertext from being
     * undetected, but cannot detect if an attacker replaces the message with a
     * valid previously-sealed message.
     * 
     * @param binaryPackagedSealedMessage The packaged messsage to unseal in binary format.
     * @return A byte array containing the unsealed message. If the sealed message
     * was a string, the caller will need to decode it from UTF8 format.
     * 
     * @exception CryptographicVerificationFailureException thrown if the ciphertext
     * is not valid and cannot be unsealed.
     */
    unsealBinaryPackagedSealedMessage(binaryPackagedSealedMessage: ByteArray): Uint8Array;
}

/**
 * Static sealing and unsealing methods common to both SymmetricKey and UnsealingKey
 */
interface StaticSealingAndUnsealing {
    /**
     * Seal a plaintext message by first deriving the required key and then performing the seal operation.
     * 
     * @param message The plaintext message to seal
     * @param seedString The secret seed used to generate the key.
     * @param derivationOptionsJson The options used to derive the key, specified using the
     * [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
     * @return A PackageSealedMessage containing the sealed ciphertext, the derivation options
     * (in plaintext) needed to (re)derive the key to unseal the ciphertext, and no
     * unsealingInstructions.
     */
    seal(message: ByteArrayOrString, seedString: string, derivationOptionsJson: string): PackagedSealedMessage;

    /**
     * Seal a plaintext message by first deriving the required key and then performing the seal operation.
     * 
     * @param message The plaintext message to seal
     * @param unsealingInstructions Instructions to be shared with the party unsealing this message
     * in plaintext, which may determine whether they will be willing to unseal the message and
     * for whom.  The instructions will be packaged along with the sealed message, but will be
     * stored in plaintext and readable by anyone with a copy of the resulting PackagedSealedMessage.
     * @param seedString The secret seed used to generate the key.
     * @param derivationOptionsJson The options used to derive the key, specified using the
     * [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
     * @return A PackageSealedMessage containing the sealed ciphertext, the derivation options
     * (in plaintext) needed to (re)derive the key to unseal the ciphertext, and the
     * unsealingInstructions (also in plaintext).
     */
    sealWithInstructions(message: ByteArrayOrString, unsealingInstructions: string, seedString: string, derivationOptionsJson: string): PackagedSealedMessage;
    
    /**
     * Unseal a message that was previously sealed into a [[PackagedSealedMessage]] format:
     * decrypting it, verifying that the
     * message hasn't been modified*, and that, if any unsealingInstructions were been
     * provided when the message was sealed, they also haven't changed. 
     * 
     * *The integrity check can prevent modifications of the ciphertext from being
     * undetected, but cannot detect if an attacker replaces the message with a
     * valid previously-sealed message.
     * 
     * @param packagedSealedMessage The packaged messsage to unseal.
     * @param seedString The secret seed that was used to generate the keys used to seal
     * the message, and which can be used to re-derive the keys to unseal it, using
     * the `keyDerivationOptionsJson` enclosed in the [[PackagedSealedMessage]].
     * @return A byte array containing the unsealed message. If the sealed message
     * was a string, the caller will need to decode it from UTF8 format.
     * 
     * @exception CryptographicVerificationFailureException thrown if the ciphertext
     * is not valid and cannot be unsealed.
     */
    unseal(packagedSealedMessage: PackagedSealedMessage, seedString: string): Uint8Array;
    /**
     * Unseal a message that was previously sealed into a [[PackagedSealedMessage]] and
     * coverted to JSON format: restoring it from JSON format, decrypting it, verifying that the
     * message hasn't been modified*, and that, if any unsealingInstructions were been
     * provided when the message was sealed, they also haven't changed. 
     * 
     * *The integrity check can prevent modifications of the ciphertext from being
     * undetected, but cannot detect if an attacker replaces the message with a
     * valid previously-sealed message.
     * 
     * @param jsonPackagedSealedMessage The packaged messsage to unseal in JSON format.
     * @param seedString The secret seed that was used to generate the keys used to seal
     * the message, and which can be used to re-derive the keys to unseal it, using
     * the `keyDerivationOptionsJson` enclosed in the [[PackagedSealedMessage]].
     * @return A byte array containing the unsealed message. If the sealed message
     * was a string, the caller will need to decode it from UTF8 format.
     * 
     * @exception CryptographicVerificationFailureException thrown if the ciphertext
     * is not valid and cannot be unsealed.
     */

    unsealJsonPackagedSealedMessage(jsonPackagedSealedMessage: string, seedString: string): Uint8Array;
    /**
     * Unseal a message that was previously sealed into a [[PackagedSealedMessage]] and
     * coverted to binary format: restoring it from a byte array, decrypting it, verifying that the
     * message hasn't been modified*, and that, if any unsealingInstructions were been
     * provided when the message was sealed, they also haven't changed. 
     * 
     * *The integrity check can prevent modifications of the ciphertext from being
     * undetected, but cannot detect if an attacker replaces the message with a
     * valid previously-sealed message.
     * 
     * @param binaryPackagedSealedMessage The packaged messsage to unseal in binary format.
     * @param seedString The secret seed that was used to generate the keys used to seal
     * the message, and which can be used to re-derive the keys to unseal it, using
     * the `keyDerivationOptionsJson` enclosed in the [[PackagedSealedMessage]].
     * @return A byte array containing the unsealed message. If the sealed message
     * was a string, the caller will need to decode it from UTF8 format.
     * 
     * @exception CryptographicVerificationFailureException thrown if the ciphertext
     * is not valid and cannot be unsealed.
     */
    unsealBinaryPackagedSealedMessage(binaryPackagedSealedMessage: ByteArray, seedString: string): Uint8Array;
}


/**
 * The static methods of the PackagedSealedMessage class.
 * 
 * @category PackagedSealedMessage
 */
export interface PackagedSealedMessageStatic extends SeededCryptoSerializableObjectStatics<PackagedSealedMessage> {
    /**
     * Construct a new PackagedSealedMessage from its three members. 
     */
    new(ciphertext: ByteArray, derivationOptionsJson: string, unsealingInstructions: string): PackagedSealedMessage;
}

/**
 * When a message is sealed, the ciphertext is packaged with the derivationOptionsJson
 * used to derive the key needed to unseal the message, as well as any optional
 * unsealingInstructions the message was sealing with.
 *
 * The static methods of this class are documented in [[PackagedSealedMessageStatic]].
 * 
 * **You must delete this object manually** by calling [[delete]] to
 * avoid memory leaks, as it is stored within the WebAssembly module
 * and is not automatically garbage collected by the JavaScript runtime.
 * 
 * @category PackagedSealedMessage
 */
export interface PackagedSealedMessage extends SeededCryptoSerializableObject {
    /**
     * The encrypted contents of the message
     */
    readonly ciphertext: Uint8Array;
    /**
     * The derivation options used to derive the key used to seal the message, and
     * which can be used to re-derive the key needed to unseal it.
     */
    readonly derivationOptionsJson: string;
    /**
     * Any unsealing instructions that parties able to unseal the message should be
     * aware of.  These are stored in plaintext and are meant to be readable by
     * anyone with a copy of the message.  However, the message cannot be unsealed
     * if these instructions have been modified.
     */
    readonly unsealingInstructions: string;
}

/**
 * The JSON encoding format of the PackagedSealedMessage class.
 * 
 * @category JSON Serialization Format
 */
export interface PackagedSealedMessageJson {
    /**
     * The encrypted contents of the message,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     */
    ciphertext: ByteArrayAsUrlSafeBase64String;
    /**
     * The derivation options used to derive the key used to seal the message, and
     * which can be used to re-derive the key needed to unseal it.
     */
    derivationOptionsJson: string;
    /**
     * Any unsealing instructions that parties able to unseal the message should be
     * aware of.  These are stored in plaintext and are meant to be readable by
     * anyone with a copy of the message.  However, the message cannot be unsealed
     * if these instructions have been modified.
     */
    unsealingInstructions: string;
}

/**
 * The static methods of the SealingKey class.
 * 
 * @category SealingKey
 */
export interface SealingKeyStatic extends DerivableFromSeed<SealingKey> {}

/**
 * A SealingKey is used to _seal_ messages, in combination with a
 * [[UnsealingKey]] which can _unseal_ them.
 * The key pair of this SealingKeys and the matching UnsealingKey are generated
 * from a seed and a set of derivation specified options in.
 * [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
 * 
 * To derive a public key from a seed, first derive the corresponding
 * [[UnsealingKey]] and then call [[UnsealingKey.getSealingKey]].
 *
 * Sealing a message (_plaintext_) creates a _ciphertext_ which contains
 * the message but from which observers who do not have the UnsealingKey
 * cannot discern the contents of the message.
 * Sealing also provides integrity-protection, which will prevent the
 * message from being unsealed if it is modified.
 * We use the verbs seal and unseal, rather than encrypt and decrypt,
 * because the encrypting alone does not confer that the message includes
 * an integrity (message authentication) code to prove that the ciphertext
 * has not been tampered with.
 * 
 * Note that sealing data does not prevent attackers who capture a sealed message
 * (ciphertext) in transit with another validly-sealed message. A [[SigningKey]]
 * can be used to sign messages that another party can verify that the
 * message has not been forged or modified since the signer approved it.
 * 
 * The static methods of this class are documented in [[SealingKeyStatic]].
 * 
 * See [[UnsealingKey]] for example code.
 * 
 * **You must delete this object manually** by calling [[delete]] to
 * avoid memory leaks, as it is stored within the WebAssembly module
 * and is not automatically garbage collected by the JavaScript runtime.
 *
 * @category SealingKey
 */
export interface SealingKey extends DerivedSecret, Sealing {
    /**
     * The raw key bytes of the sealing key.
     */
    readonly sealingKeyBytes: Uint8Array;
}

/**
 * The JSON encoding format of the SealingKey class.
 * 
 * @category JSON Serialization Format
 */
export interface SealingKeyJson extends DerivedSecretJson {
    /**
     * The raw key bytes of the sealing key,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     */
    sealingKeyBytes: ByteArrayAsUrlSafeBase64String;
}

/**
 * The static methods of the Secret class.
 * @category Secret
 */
export interface SecretStatic extends DerivableFromSeed<Secret> {}

/**
 * A secret derived from another secret, in the form of a seed string, 
 * and set of derivation options specified ([[derivationOptionsJson]]) using the
 * [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
 * 
 * Because the secret is derived using a one-way function,
 * its value does not reveal the secret seed used to derive it.
 * Rather, clients can use this secret knowing that, if lost,
 * it can be re-derived from the same seed and
 * [[derivationOptionsJson]] that were first used to derive it.
 *
 * The static methods of this class are documented in [[SecretStatic]].
 * 
 * **You must delete this object manually** by calling [[delete]] to
 * avoid memory leaks, as it is stored within the WebAssembly module
 * and is not automatically garbage collected by the JavaScript runtime.
 *
 * ```typescript
 * import {SeededCryptoModulePromise} from "seeded-crypto";
 * 
 * async function demo(
 *     mySeedString: string,
 *     myDerivationOptionsJson: string = ""
 * ): Promise<Uint8Array> {
 *     // Ensure the module is loaded and compiled before we use it.
 *     const seededCryptoModule = await SeededCryptoModulePromise;
 *     // Derive the secret.
 *     const secret = seededCryptoModule.Secret.deriveFromSeed(
 *         mySeedString, myDerivationOptionsJson
 *     );
 *     // Extract the secret bytes from the [[Secret]] before deleting it.
 *     const {secretBytes} = secret;
 *     secret.delete();
 *     // Return the secret bytes to the caller
 *     return secretBytes;
 * }
 * ```
 * 
 * @category Secret
 */
export interface Secret extends DerivedSecret {
    /**
     * The array of bytes that constitutes the derived secret.
     */
    readonly secretBytes: Uint8Array;
}

   

/**
 * The JSON encoding format of the Secret class.
 * 
 * @category JSON Serialization Format
 */
export interface SecretJson extends DerivedSecretJson {
    /**
     * The array of bytes that constitutes the derived secret,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     */
    secretBytes: ByteArrayAsUrlSafeBase64String;
}

/**
 * The static methods of the SignatureVerificationKey class.
 * @category SignatureVerificationKey
 */
export interface SignatureVerificationKeyStatic extends DerivableFromSeed<SignatureVerificationKey> {}

/**
 * A SignatureVerificationKey is used to verify that messages were
 * signed by its corresponding SigningKey.
 * SigningKeys generate _signatures_, and by verifying a message/signature
 * pair the SignatureVerificationKey can confirm that the message was
 * indeed signed using the SigningKey.
 * The key pair of the SigningKey and SignatureVerificationKey is generated from a seed
 * and set of derivation specified options in specified using the
 * [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
 * 
 * To derive a SignatureVerificationKey from a seed, first derive the
 * corresponding SigningKey and then call [[SigningKey.getSignatureVerificationKey]].
 * 
 * The static methods of this class are documented in [[SigningKeyStatic]].
 * 
 * For code examples, see [[SigningKey]].
 * 
 * **You must delete this object manually** by calling [[delete]] to
 * avoid memory leaks, as it is stored within the WebAssembly module
 * and is not automatically garbage collected by the JavaScript runtime.
 * 
 * @category SignatureVerificationKey
 */
export interface SignatureVerificationKey extends DerivedSecret {
    /**
     * The raw key bytes used to verify signatures.
     */
    readonly signatureVerificationKeyBytes: Uint8Array;
    /**
     * Verify that a signature is valid in order to prove that a message
     * has been signed with the SigningKey from which this SignatureVerificationKey
     * was generated.
     * 
     * @param message The message validate the signature of.
     * @param signature The signature that, if verified, proves the message was signed
     * by the [[SigningKey]] that is paired with this [[SignatureVerificationKey]].
     */
    verify(message: ByteArrayOrString, signature: ByteArray): boolean;
}

/**
 * The JSON encoding format of the SignatureVerificationKey class.
 * 
 * @category JSON Serialization Format
 */
export interface SignatureVerificationKeyJson extends DerivedSecretJson {
    /**
     * The raw key bytes used to verify signatures,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     */
    signatureVerificationKeyBytes: ByteArrayAsUrlSafeBase64String;
}

/**
 * The static methods of the SigningKey class.
 * 
 * @category SigningKey
 */
export interface SigningKeyStatic extends DerivableFromSeed<SigningKey> {
    generateSignature(message: ByteArrayOrString, seedString: string, derivationOptionsJson: string): Uint8Array;
}

/**
 * A SigningKey generates _signatures_ of messages which can then be
 * used by the corresponding SignatureVerificationKey to verify that a message
 * was signed by  can confirm that the message was indeed signed by the
 * SigningKey and has not since been tampered with.
 *
 * The corresponding SignatureVerificationKey can be obtained by calling
 * getSignatureVerificationKey.
 * 
 * The key pair of the SigningKey and SignatureVerificationKey is generated
 * from a seed and set of derivation specified options in specified using the
 * [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
 *
 * The static methods of this class are documented in [[SigningKeyStatic]].
 * 
 * **You must delete this object manually** by calling [[delete]] to
 * avoid memory leaks, as it is stored within the WebAssembly module
 * and is not automatically garbage collected by the JavaScript runtime.
 * 
 * ```typescript
 * import {SeededCryptoModulePromise} from "seeded-crypto";
 * 
 * async function demo(mySeedString: string, myDerivationOptionsJson: string = "") {
 *   // Ensure the module is loaded and compiled before we use it.
 *   const seededCryptoModule = await SeededCryptoModulePromise;    
 *   // Get a key used to sign and the corresponding key used to verify signatures.
 *   const signingKey = seededCryptoModule.SigningKey.deriveFromSeed(
 *       mySeedString, myDerivationOptionsJson
 *   );
 *   const signatureVerificationKey = signingKey.getSignatureVerificationKey();
 *   // Sign a message
 *   const message = "The poodle rides at midnight.";
 *   const signature = signingKey.generateSignature("The poodle rides at midnight.");
 *   signatureVerificationKey.delete();
 *   //
 *   // ... time passes and we need to verify the signature
 *   //
 *   const restoredSignatureVerificationKey =
 *    seededCryptoModule.SignatureVerificationKey.fromJson(signatureVerificationKeyJson);
 *   const isMessageValid = restoredSignatureVerificationKey.verify(message, signature); // true
 *   // Make sure to delete objects when you're done using them.
 *   signingKey.delete();
 * }
 * ```
 *
 * @category SigningKey
 */  
 export interface SigningKey extends Omit<DerivedSecret, "toCustomJson"> {
    /**
     * The raw key bytes used to generate signatures.
     */
    readonly signingKeyBytes: Uint8Array;
    /**
     * The raw key bytes used to verify signatures.
     */
    readonly signatureVerificationKeyBytes: Uint8Array;
    /**
     * Serialize this object into JSON format using custom indentation.
     * 
     * @param minimizeSizeByRemovingTheSignatureVerificationKeyBytesWhichCanBeRegeneratedLater If true,
     * save space by excluding the [[signatureVerificationKeyBytes]] from JSON format since they can
     * be re-derived from the [[signingKeyBytes]].
     * @param indent The number of characters to indent
     * @param indentCharCode The unicode char code to indent, which you
     * can generate by creating a one-character string followed by
     * `.charCodeAt(0)`. For tabs, that would be `"\t".charCodeAt(0).` 
     * @returns This object in JSON format.
     */

    toCustomJson(
        minimizeSizeByRemovingTheSignatureVerificationKeyBytesWhichCanBeRegeneratedLater: boolean,
        indent: number,
        indentCharCode: number
    ): string;
    /**
     * Get the signatureVerificationKey which can be shared with others so that they can
     * verify signatures generated with this key, thus proving that messages were indeed
     * signed by this key.
     */
    getSignatureVerificationKey(): SignatureVerificationKey;
    /**
     * Sign a message that can be validated as having been signed by this key with the
     * corresponding [[SignatureVerificationKey]].  That [[SignatureVerificationKey]]
     * can be generated by calling [[`getSignatureVerificationKey`]].
     * @param message The message to generate a signature for.
     */
    generateSignature(message: ByteArrayOrString): Uint8Array;
}

/**
 * The JSON encoding format of the SigningKey class.
 *
 * @category JSON Serialization Format
 */
export interface SigningKeyJson extends DerivedSecretJson {
    /**
     * The raw key bytes used to generate signatures,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     */
    signingKeyBytes: ByteArrayAsUrlSafeBase64String;
    /**
     * The raw key bytes used to verify signatures,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     * 
     * This field is optional because, if it's not provided,
     * it can be re-derived from the [[signingKeyBytes]] when the
     * object is reconstituted.  (It does so on an as-needed basis,
     * so if the field is never used, we save both on storage by
     * not including this field and on computation if we never
     * need to re-derive it.)
     */

    signatureVerificationKeyBytes?: ByteArrayAsUrlSafeBase64String;
}

/**
 * The static methods of the SymmetricKey class.
 * 
 * @category SymmetricKey
 */
export interface SymmetricKeyStatic extends DerivableFromSeed<SymmetricKey>, StaticSealingAndUnsealing {}

/**
 * A SymmetricKey can be used to seal and unseal messages.
 * This SymmetricKey class can be (re) derived from a seed using
 * the set of derivation specified options in specified via the
 * [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
 * So, you can use this symmetric-key to seal a message, throw the
 * key away, and re-generate the key when you need to unseal the
 * message so long as you still have the original seed and
 * derivationOptionsJson.
 *  
 * Sealing a message (_plaintext_) creates a _ciphertext which contains
 * the message but from which observers who do not have the UnsealingKey
 * cannot discern the contents of the message.
 * Sealing also provides integrity-protection, which will preven the
 * message from being unsealed if it is modified.
 * We use the verbs seal and unseal, rather than encrypt and decrypt,
 * because the encrypting alone does not confer that the message includes
 * an integrity (message authentication) code to prove that the ciphertext
 * has not been tampered with.
 * 
 * The seal operation is built on LibSodium's crypto_secretbox_easy function,
 * but despite it's name the construct isn't as easy as it should be.
 * The caller must store both the ciphertext AND a 24-byte nonce
 * (crypto_secretbox_NONCEBYTES = 24).
 * Hence, the SymmetricKey seal operation outputs a _composite_ ciphertext
 * containing the nonce followed by the "secret box" ciphertext generated by LibSodium.
 * Since the "secret box" is 16 bytes longer than the message size
 * (crypto_secretbox_MACBYTES = 16),
 * the composite ciphertext is is 40 bytes longer than the message length
 * (24 for then nonce, plus the 16 added to create the secret box)
 *
 * The static methods of this class are documented in [[SymmetricKeyStatic]].
 *
 * **You must delete this object manually** by calling [[delete]] to
 * avoid memory leaks, as it is stored within the WebAssembly module
 * and is not automatically garbage collected by the JavaScript runtime.
 * 
 * ```typescript
 * import {SeededCryptoModulePromise} from "seeded-crypto";
 * 
 * async function demo(mySeedString: string, myDerivationOptionsJson: string = "") {
 *    // Ensure the module is loaded and compiled before we use it.
 *    const seededCryptoModule = await SeededCryptoModulePromise;    
 *    // To get a sealing key, you first need to derive the corresponding unsealing key.
 *    const symmetricKey = seededCryptoModule.SymmetricKey.deriveFromSeed(
 *        mySeedString, myDerivationOptionsJson
 *    );
 *    // Seal a message
 *    const packagedSealedMessage = symmetricKey.seal("The poodle rides at midnight.");
 *    // Make sure to delete objects when you're done using them.
 *    symmetricKey.delete();
 *    // We'll unseal the message by re-deriving the SymmetricKey from the seed string.
 *    const messageAsUint8Array: Uint8Array =
 *        seededCryptoModule.SymmetricKey.unseal(packagedSealedMessage, mySeedString); 
 *    const message: string = new TextDecoder("utf-8").decode(messageAsUint8Array);
 *    // Make sure to delete objects when you're done using them.
 *    symmetricKey.delete();
 *    // Re-derive the UnsealingKey and unseal the message in one operation.
 * }
 * ```
 *
 * @category SymmetricKey
 */   
export interface SymmetricKey extends DerivedSecret, Sealing, Unsealing {
    /**
     * The raw symmetric key bytes used to seal and unseal messages.
     */
    readonly keyBytes: Uint8Array;
}

/**
 * The JSON encoding format of the SymmetricKey class.
 * 
 * @category JSON Serialization Format
 */
export interface SymmetricKeyJson extends DerivedSecretJson {
    /**
     * The raw symmetric key bytes used to seal and unseal messages,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
    */
    keyBytes: ByteArrayAsUrlSafeBase64String;
}

/**
 * The static methods of the UnsealingKey class.
 * 
 * @category UnsealingKey
 */
export interface UnsealingKeyStatic extends DerivableFromSeed<UnsealingKey>, StaticSealingAndUnsealing {
}

/**
 * An UnsealingKey is used to _unseal_ messages sealed with its
 * corresponding [[SealingKey]].
 * The UnsealingKey and [[SealingKey]] are generated
 * from a seed and set of derivation specified options in specified using the
 * [JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
 * 
 * The UnsealingKey includes a copy of the [[sealingKeyBytes]], which can be
 * used to reconstruct the [[SealingKey]] by calling [[getSealingKey]].
 *
 * The static methods of this class are documented in [[UnsealingKeyStatic]].
 * 
 * **You must delete this object manually** by calling [[delete]] to
 * avoid memory leaks, as it is stored within the WebAssembly module
 * and is not automatically garbage collected by the JavaScript runtime.
 * 
 * ```typescript
 * import {SeededCryptoModulePromise} from "seeded-crypto";
 * 
 * async function demo(mySeedString: string, myDerivationOptionsJson: string = "") {
 *     // Ensure the module is loaded and compiled before we use it.
 *     const seededCryptoModule = await SeededCryptoModulePromise;    
 *     // To get a sealing key, you first need to derive the corresponding unsealing key.
 *     const unsealingKey = seededCryptoModule.UnsealingKey.deriveFromSeed(
 *         mySeedString, myDerivationOptionsJson
 *     );
 *    const sealingKey = unsealingKey.getSealingKey();
 *    // Make sure to delete objects when you're done using them.
 *    unsealingKey.delete();
 *    // Seal a message
 *    const packagedSealedMessage = sealingKey.seal("The poodle rides at midnight.");
 *    sealingKey.delete();
 *    // Re-derive the UnsealingKey and unseal the message in one operation.
 *    const messageAsUint8Array: Uint8Array =
 *      seededCryptoModule.UnsealingKey.unseal(packagedSealedMessage, mySeedString); 
 *    const message: string = new TextDecoder("utf-8").decode(messageAsUint8Array);
 * }
 * ```
 * @category UnsealingKey
 */
export interface UnsealingKey extends DerivedSecret, Unsealing {
//export interface UnsealingKey extends DerivedSecret, Unsealing {
    /**
     * The raw key bytes of the key used to seal messages,
     * kept here for use when [[getSealingKey]] is called.
     */
    readonly sealingKeyBytes: Uint8Array;
    /**
     * The raw key bytes of the key used to unseal messages that were
     * previously sealed by the sealing key.
     */
    readonly unsealingKeyBytes: Uint8Array;
    getSealingKey(): SealingKey;
}

/**
 * The JSON encoding format of the UnsealingKey class.
 * 
 * @category JSON Serialization Format
 */
export interface UnsealingKeyJson extends DerivedSecretJson {
    /**
     * The raw key bytes of the key used to seal messages,
     * kept with the unsealing key for use when [[getSealingKey]] is called,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     */
    sealingKeyBytes: ByteArrayAsUrlSafeBase64String;
    /**
     * The raw key bytes of the key used to unseal messages that were
     * previously sealed by the sealing key,
     * encoded to URL-safe Base64 per [RFC 4648 Section 5](https://tools.ietf.org/html/rfc4648#section-5).
     */
    unsealingKeyBytes: ByteArrayAsUrlSafeBase64String;
}


interface SeededCryptoModule extends EmscriptenModule {
    /**
     * @category SeededCryptoModule
     */
    PackagedSealedMessage: PackagedSealedMessageStatic;
    /**
     * @category SeededCryptoModule
     */
    SealingKey: SealingKeyStatic;
    /**
     * @category SeededCryptoModule
     */
    Secret: SecretStatic;
    /**
     * @category SeededCryptoModule
     */
    SignatureVerificationKey: SignatureVerificationKeyStatic;
    /**
     * @category SeededCryptoModule
     */
    SigningKey: SigningKeyStatic;
    /**
     * @category SeededCryptoModule
     */
    SymmetricKey: SymmetricKeyStatic;
    /**
     * @category SeededCryptoModule
     */
    UnsealingKey: UnsealingKeyStatic;
}

// Emscripten promises are kinda like promises... but it's important that we
// not get lulled into thinking they're actually promises.
// https://github.com/emscripten-core/emscripten/issues/5820
interface SeededCryptoModuleNotReallyAPromise {
    then: (fn: (SeededCrypto: SeededCryptoModule) => any) => void
}


/**
 * A Wrapper for the WebAssembly module the implements the DiceKeys Sealed Cryptography library.
 * 
 * To instatiate a derived secret or key, call the `deriveFromSeed` operation on the appropriate
 * member of this module. For example:
 * ```
 * const symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
 * ```
 * 
 * Or use the static constructors to restore serialized objects, or use
 * static methods which all you to both derive a key and perform an
 * operation with it in one fell swoop.
 * ```
 * const unsealingKey = module.UnsealingKey.fromJson(unsealingKeyStoredAsJson);
 * ```
 *
 * @category Module Access
 */
export interface SeededCryptoModuleWithHelpers extends SeededCryptoModule,
  TypedMemoryHelpersForEmscriptenModule<PtrIntoSeededCryptoModule> {}

/**
 * Import and await this value to get access to the module's API, ensuring that the
 * runtime has downloaded the underlying WebAssembly code and compiled it before
 * any operations are called.
 * 
 * @category Module Access
 */
export const SeededCryptoModulePromise: Promise<SeededCryptoModuleWithHelpers> =
  getWebAsmModulePromiseWithAugmentedTypes(
    (SeededCryptoModuleNotReallyAPromiseFn as (module?: Partial<EmscriptenModule>) => SeededCryptoModuleNotReallyAPromise)()
  );
