/**
 * Specify that the derivation use a more computionally expensive hash function
 * designed to slow brute-force guessing attacks.
 * 
 * @category DerivationOptions
 */
export interface DerivationOptionsForIteratedMemoryBoundHashFunction {
  hashFunction: "BLAKE2b" | "SHA256";
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

/**
 * The derivation options for a [[Secret]].
 * 
 * @category DerivationOptions
 */
export interface DerivationOptionsForSecret {
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
 * The derivation options for a [[SymmetricKey]].
 * 
 * @category DerivationOptions
 */
export interface DerivationOptionsforSymmetricKey {
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
 * The derivation options for an [[UnsealingKey]].
 * 
 * @category DerivationOptions
 */
export interface DerivationOptionsForUnsealingKey {
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
 * The derivation options for a [[SigningKey]].
 * 
 * @category DerivationOptions
 */
export interface DerivationOptionsForSigningKey {
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


type WithOptionalHashFunction = {
  type?: "Secret" | "SigningKey" | "SymmetricKey" | "UnsealingKey";
  hashFunction?: "Argon2id" | "Scrypt" | "BLAKE2b" | "SHA256";
} | DerivationOptionsForIteratedMemoryBoundHashFunction;


/**
 * The DerivationOptions used by the Seeded Crypto library.
 * (Other options may appear in layers above that library.)
 * 
 * @category DerivationOptions
 */
export type DerivationOptions = (
  DerivationOptionsForSecret |
  DerivationOptionsforSymmetricKey |
  DerivationOptionsForUnsealingKey |
  DerivationOptionsForSigningKey
) & WithOptionalHashFunction ;
