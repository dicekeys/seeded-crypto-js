

export type UInt32 = number;
export type UInt64 = number;

export const Argon2id_Defaults = {
  hashFunctionMemoryLimitInBytes: 67108864,
  hashFunctionMemoryPasses: 2
} as const;


export interface AuthenticationRequirements {
  // Required if restrictions, will only send results to permitted URL prefixes
  urlPrefixesAllowed?: string[]
  // Require an authentication handshake before performing other operations
  requireAuthenticationHandshake?: boolean
  // May substitute android package for URL if on android platform
  // (But still must specify urlPrefixesAllowed)
  androidPackagePrefixesAllowed?: string[],
}
export const AuthenticationRequirementsFieldNames = [
  "androidPackagePrefixesAllowed",
  "urlPrefixesAllowed",
  "requireAuthenticationHandshake"
] as const;
export type AuthenticationRequirementsFieldNames = keyof AuthenticationRequirements;
// The block of code below exists only to force TypeScript
// to validate the correctness of the above array.
(() => {
	const validateThatAllArrayValuesAreValid:
		readonly AuthenticationRequirementsFieldNames[] = AuthenticationRequirementsFieldNames;
	const validateThatAllArrayValuesAreIncluded:
		(typeof AuthenticationRequirementsFieldNames)[number] = "" as AuthenticationRequirementsFieldNames;
});


type HashFunction = "BLAKE2b" | "SHA256" | "Argon2id" | "Scrypt";


interface KeyDerivationOptionsForApplicationSpecificOperations extends AuthenticationRequirements {
  /**
	 * Hash function for deriving keys from the DiceKey and salt.
   */
  hashFunction?: "BLAKE2b" | "SHA256" | "Argon2id" | "Scrypt" // ParameterlessHashAlgorithm | ParameterizedHashAlgorithm;
  hashFunctionMemoryLimitInBytes?: UInt64; // default 67108864U, which is crypto_pwhash_MEMLIMIT_INTERACTIVE from LibSodium
  hashFunctionMemoryPasses?: UInt32; // default 2, which is crypto_pwhash_OPSLIMIT_INTERACTIVE from LibSodium


  /**
   * If true, orientations (rotations) of the faces are used as an input into
   * the key generation algorithm, and changing a single orientation will change
   * the key.
   * If false, the key will only be a function of the letter and digit on each
   * face, and will not be impacted by rotation.  Thus, if users try to transcribe
   * the key, any errors in rotation will not impact the correctness of the key.
   * 
   * Default: false
   */
  excludeOrientationOfFaces?: boolean;

  urlPrefixesAllowed?: string[];
  requireAuthenticationHandshake?: boolean;
  androidPackagePrefixesAllowed?: string[];
  clientMayRetrieveKey?: boolean; // false

  
}

// interface RestrictToClientApplicationsIdPrefixes {
//   /**
//    * Only allow this key to be used/revealed to applications
//    * that have a package ID starting with one of the
//    * prefixes on this allow-list
//    *
//    * Not used for if the type is:
//    *   ForPublicKeySealedMesssagesWithRestrictionsEnforcedPostDecryption
//    * as application restrictions will be encoded into the sealed data.
//   */
//   restrictToClientApplicationsIdPrefixes?: string[]
// }


interface DerivationOptionsForSecret extends
  KeyDerivationOptionsForApplicationSpecificOperations
{
  type?: "Secret";
  lengthInBytes?: UInt32; // Default 32
}

interface DerivationOptionsforSymmetricKey extends
  KeyDerivationOptionsForApplicationSpecificOperations
{
  type?: "SymmetricKey";
  algorithm?: "XSalsa20Poly1305";
}

interface DerivationOptionsForUnsealingKey extends
  KeyDerivationOptionsForApplicationSpecificOperations
 {
  type?: "UnsealingKey";
  algorithm?: "X25519";
}

interface DerivationOptionsForSigningKey extends
  KeyDerivationOptionsForApplicationSpecificOperations
 {
  type?: "SigningKey";
  algorithm?: "Ed25519";
}

export type KeyDerivationOptions =
  DerivationOptionsForSecret |
  DerivationOptionsforSymmetricKey |
  DerivationOptionsForUnsealingKey |
  DerivationOptionsForSigningKey;

export type KeyDerivationFieldName =
  (keyof DerivationOptionsForSecret) |
  (keyof DerivationOptionsforSymmetricKey) |
  (keyof DerivationOptionsForUnsealingKey) |
  (keyof DerivationOptionsForSigningKey);
export const KeyDerivationFieldNames = [
  ...AuthenticationRequirementsFieldNames,
  "algorithm",
  "hashFunction",
  "hashFunctionMemoryLimitInBytes", // default 67108864U, which is crypto_pwhash_MEMLIMIT_INTERACTIVE from LibSodium
  "hashFunctionMemoryPasses", // default 2, which is crypto_pwhash_OPSLIMIT_INTERACTIVE from LibSodium
  "lengthInBytes",
  "type",
  "excludeOrientationOfFaces",
  "urlPrefixesAllowed",
  "requireAuthenticationHandshake",
  "androidPackagePrefixesAllowed",
  "clientMayRetrieveKey"
//  "userEnteredSecret",
//  "restrictToClientApplicationsIdPrefixes"
] as const;
// The block of code below exists only to force TypeScript
// to validate the correctness of the above array.
(() => {
const validateThatAllKeyDerivationFieldNamesAreValid:
  readonly KeyDerivationFieldName[] = KeyDerivationFieldNames;
const validateThatAllKeyDerivationFieldNamesAreIncluded:
  (typeof KeyDerivationFieldNames)[number] = "" as KeyDerivationFieldName;
})

// export type HashFunctionSpecifierFieldName = (keyof ParameterizedHashAlgorithm);
// export const HashFunctionSpecifierFieldNames = [
// 	"algorithm",
// 	"memLimit",
// 	"opsLimit",
// ] as const;
// // The block of code below exists only to force TypeScript
// // to validate the correctness of the above array.
// (() => {
// 	const validateThatAllHashFunctionSpecifierFieldNamesAreValid:
//   readonly HashFunctionSpecifierFieldName[] = HashFunctionSpecifierFieldNames;
// const validateThatAllHashFunctionSpecifierFieldNamesAreIncluded:
//   (typeof HashFunctionSpecifierFieldNames)[number] = "" as HashFunctionSpecifierFieldName;
// })

// Secret
// Symmetric
// Public
export type type = KeyDerivationOptions["type"]
export const types = [
  "Secret",
  "SymmetricKey",
  "UnsealingKey",
  "SigningKey"
] as const;
// The block of code below exists only to force TypeScript
// to validate the correctness of the above array.
(() => {
const validateThatAlltypesAreValid:
  readonly type[] = types;
const validateThattypesAreIncluded:
  (typeof types)[number] | undefined = "" as type;
});

export type Algorithm = (
    DerivationOptionsforSymmetricKey |
    DerivationOptionsForUnsealingKey |
    DerivationOptionsForSigningKey
  )["algorithm"];
export const Algorithms = [
  "XSalsa20Poly1305",
  "X25519",
  "Ed25519"
] as const;
// The block of code below exists only to force TypeScript
// to validate the correctness of the above array.
(() => {
const validateThatAllAlgorithmsAreValid:
  readonly Algorithm[] = Algorithms;
const validateThatAlgorithmsAreIncluded:
  (typeof Algorithms)[number] | undefined = "" as Algorithm;
});

export const HashFunctions = [
	"BLAKE2b", "SHA256", 	"Argon2id", "Scrypt"
] as const;
// The block of code below exists only to force TypeScript
// to validate the correctness of the above array.
(() => {
	const validateThatAllArrayValuesAreValid:
		readonly HashFunction[] = HashFunctions;
	const validateThatAllArrayValuesAreIncluded:
		(typeof HashFunctions)[number] = "" as HashFunction;
});

const getKeyDerivationParametersFromDerivationOptions = ({
    hashFunction = "SHA256",
    ...options
}: KeyDerivationOptions) => ({
  hashFunction,
  lengthInBytes:
    // Key for application use use lengthInBytes if set, 32 byte default otherwise
    options.type === "Secret" ? (options.lengthInBytes || 32) :
    // x25519 uses a 256-bit key
    options.type === "UnsealingKey" && options.algorithm === "X25519" ? 32 :
    // Ed25519 uses a 256-bit key
    options.type === "SigningKey" && options.algorithm === "Ed25519" ? 32 :
    // XSalsa20Poly1305 uses a 256-bit key
    options.type === "SymmetricKey" && options.algorithm ===  "XSalsa20Poly1305" ? 32 :
    // The Algorithm provided is one that was not in the specification
    // when this code shipped, and so we have no idea if we have the
    // correct key length.  Therefore, we can't generate the key.
    // Best to throw an exception. 
    (() => {throw Error("Invalid Algorithm in key generation options");} )()
});
