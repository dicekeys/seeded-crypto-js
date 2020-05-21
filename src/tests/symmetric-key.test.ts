import {
    SeededCryptoModulePromise,
    SymmetricKey    
} from "../seeded-crypto"
import { strictEqual } from "assert";

test("Got jest?", () => {
    expect(true);
})

describe("SymmetricKey", () => {

    const seedString = "yo";
    const derivationOptionsJson = `{"ValidJson": "This time!"}`;
    const plaintext = "perchance to SCREAM!";
    const unsealingInstructions = "run, do not walk, to the nearest cliche."

    test('seal and unseal', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        strictEqual(derivationOptionsJson, symmetricKey.derivationOptionsJson);
        const keyBytes = symmetricKey.keyBytes;
        strictEqual(keyBytes.length, 32);
        const message = symmetricKey.seal(plaintext, unsealingInstructions);
        strictEqual(message.derivationOptionsJson, derivationOptionsJson);
        strictEqual(message.unsealingInstructions, unsealingInstructions);
        const recoveredPlaintextBytes = symmetricKey.unseal(message);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        symmetricKey.delete();
        // console.log("key as json", key.toJson());
        // console.log("key as json", key.toCustomJson(2, "\t".charCodeAt(0)));
        // console.log("key bytes", key.keyBytes);
    });

    test('static unseal', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.seal(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = module.SymmetricKey.unseal(message, seedString);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    test('unseal from json', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.seal(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = symmetricKey.unsealJsonPackagedSealedMessage(message.toJson());
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    test('unseal from binary', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.seal(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = symmetricKey.unsealBinaryPackagedSealedMessage(message.toSerializedBinaryForm());
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    
    test('static unseal from json', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.seal(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = module.SymmetricKey.unsealJsonPackagedSealedMessage(message.toJson(), seedString);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    test('static unseal from binary', async () => {
        var module = await SeededCryptoModulePromise;
        var message = module.SymmetricKey.seal(plaintext, unsealingInstructions, seedString, derivationOptionsJson);
        const recoveredPlaintextBytes = module.SymmetricKey.unsealBinaryPackagedSealedMessage(message.toSerializedBinaryForm(), seedString);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });


});