# Introduction

This Seeded Cryptography Library was written to support the DiceKeys project.
It is built on top of the [DiceKeys C++ Seeded Cryptography Library](https://github.com/dicekeys/seeded-crypto)
([documentation](https://dicekeys.github.io/seeded-crypto/)), which is compiled into
[WebAssembly](https://webassembly.org/) using the [emscripten](https://emscripten.org/) compiler.


It is an _object oriented_ cryptographic library, with keys
([[SymmetricKey]], [[UnsealingKey]] & [[SealingKey]], [[SigningKey]] & [[SignatureVerificationKey]])
as first-class objects,
and cryptographic operations implemented as methods on those keys.
It also supports a derived [[Secret]] class, into which
cryptographic-strength secrets can be derived and shared with
clients that want to implement their own cryptographic operations.

```typescript
import {SeededCryptoModulePromise} from "seeded-crypto";
await seededCryptoModule = await SeededCryptoModulePromise;
const symmetricKey = seededCryptoModule.SymmetricKey.deriveFromSecret(...);
const plaintext = "Wait long enough, and grilled cheese becomes its own spoonerism.");
const sealedMessage = symmetricKey.seal(plaintext);
```

All keys and secrets are derived from _seed_ strings, using options specified in
[JSON Derivation Options format](https://dicekeys.github.io/seeded-crypto/derivation_options_format.html).
This is different from most other libraries, which generate keys via a random number generator.
(You can still create strong random keys by deriving them from a strong random seed string.)

```typescript
const unsealingKey = UnsealingKey.deriveFromSeed(
    // The seed string. Hopefully better than Randall Munroe's
    "valid equine capacitor paperclip wrong bovine ground luxury",
    // Since the seed is still a bit short, use a memory-hard
    // derivation function to derive the key, not just a simple hash.
    `{hashFunction: "Argon2id"}`
);
```

Like [LibSodium](https://libsodium.gitbook.io/doc/), the cryptogrpahic library
on which the Seeded Cryptography Library is built, this library is opnionated.
It offers a small number of safe options to direct users to good choices, rather
than offering a wide variety with some potentially-dangerous choices.
For example, instead of _encrypt_ and
_decrypt_ operations, the library supports only _seal_ and _unseal_.
The difference is that sealing a message always attaches a message authentication code (MAC)
to the ciphertext, and unsealing always ensures that the ciphertext has not been modified
by checking the MAC.
The seal operation also packages the ciphertext along with the derivation options
needed to derive the key needed to unseal the message from the seed.

When sealing data, you can also attach a string that must be known
to anyone unsealing the message.  This is separate from the key and is
included in plaintext in PackagedSealedMessage returned by the seal operation.
You can use it, for example, to attach
instructions about how such messages should be treated when unsealing.
Those instructions are stored in plaintext within the PackagedSealedMessage.

```typescript
const symmetricKey = seededCryptoModule.SymmetricKey.deriveFromSeed(...);
const plaintext = "Wait long enough, and grilled cheese becomes its own spoonerism.";
const unsealingInstructions =
    "Unsealed messages should be shared only with those who like wordplay.";
const sealedMessage = sk.sealWithInstructions(plaintext, unsealingInstructions);
const matches: boolean = sealedmessage.unsealingInstructions === unsealingInstructions; // true
```

All keys and mesage packages in this library can be easily serialized into
either JSON format or a binary format, and deserialized,
freeing those using the library from having to implement their own
serialization methods.

```typescript
const sealingKey = seededCryptoModule.SealingKey.fromJson(SealingKeyAsJson);
const sealingKeyAsUint8Array = sealingKey.toSerializedBinaryForm();
const copyOfSealingKey = seededCryptoModule.SealingKey.fromSerializedBinaryForm(public_key_as_binary);
```

Because all derived objects and [[PackagedSealedMessage]]s
are allocated in the WebAssembly module's memory,
**you must** delete them manually to avoid memory leaks.