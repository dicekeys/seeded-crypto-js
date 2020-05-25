import {
    SeededCryptoModulePromise,
} from "../seeded-crypto"
import {TextDecoder} from "util";
import { strictEqual } from "assert";

describe("SymmetricKey", () => {

    const seedString = "yo";
    const derivationOptionsJson = `{"ValidJson": "This time!"}`;
    const plaintext = "perchance to SCREAM!";
    const unsealingInstructions = "run, do not walk, to the nearest cliche."

    test('seal and unseal with instructions', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        strictEqual(derivationOptionsJson, symmetricKey.derivationOptionsJson);
        const keyBytes = symmetricKey.keyBytes;
        strictEqual(keyBytes.length, 32);
        const message = symmetricKey.sealWithInstructions(plaintext, unsealingInstructions);
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

    test('seal no instructions and static unseal', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        strictEqual(derivationOptionsJson, symmetricKey.derivationOptionsJson);
        const keyBytes = symmetricKey.keyBytes;
        strictEqual(keyBytes.length, 32);
        const message = symmetricKey.seal(plaintext);
        strictEqual(message.derivationOptionsJson, derivationOptionsJson);
        strictEqual(message.unsealingInstructions, "");
        const recoveredPlaintextBytes = module.SymmetricKey.unseal(message, seedString);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        symmetricKey.delete();
    });

    test('raw seal', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        strictEqual(derivationOptionsJson, symmetricKey.derivationOptionsJson);
        const ciphertext = symmetricKey.sealToCiphertextOnly(plaintext);
        const message = new module.PackagedSealedMessage(ciphertext, derivationOptionsJson, "");
        strictEqual(message.derivationOptionsJson, derivationOptionsJson);
        strictEqual(message.unsealingInstructions, "");
        const recoveredPlaintextBytes = symmetricKey.unseal(message);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        symmetricKey.delete();
    });

    test('raw seal with instructions', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        strictEqual(derivationOptionsJson, symmetricKey.derivationOptionsJson);
        const ciphertext = symmetricKey.sealToCiphertextOnlyWithInstructions(plaintext, unsealingInstructions);
        const message = new module.PackagedSealedMessage(ciphertext, derivationOptionsJson, unsealingInstructions);
        strictEqual(message.derivationOptionsJson, derivationOptionsJson);
        strictEqual(message.unsealingInstructions, unsealingInstructions);
        const recoveredPlaintextBytes = symmetricKey.unseal(message);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        symmetricKey.delete();
    });

    
    test('raw unseal', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.sealWithInstructions(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = symmetricKey.unsealCiphertext(message.ciphertext, message.unsealingInstructions);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    test('static unseal', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.sealWithInstructions(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = module.SymmetricKey.unseal(message, seedString);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    test('unseal from json', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.sealWithInstructions(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = symmetricKey.unsealJsonPackagedSealedMessage(message.toJson());
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    test('unseal from binary', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.sealWithInstructions(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = symmetricKey.unsealBinaryPackagedSealedMessage(message.toSerializedBinaryForm());
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    
    test('static unseal from json', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.sealWithInstructions(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = module.SymmetricKey.unsealJsonPackagedSealedMessage(message.toJson(), seedString);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    test('static unseal from binary', async () => {
        var module = await SeededCryptoModulePromise;
        var message = module.SymmetricKey.sealWithInstructions(plaintext, unsealingInstructions, seedString, derivationOptionsJson);
        const recoveredPlaintextBytes = module.SymmetricKey.unsealBinaryPackagedSealedMessage(message.toSerializedBinaryForm(), seedString);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });


});