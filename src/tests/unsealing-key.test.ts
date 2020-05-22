import {
    SeededCryptoModulePromise,
} from "../seeded-crypto"
import { strictEqual } from "assert";

describe("UnsealingKey", () => {

    const seedString = "Avocado";
    const derivationOptionsJson = `{"HumorStyle": "Boomer"}`;
    const plaintext = "This seals the deal!";
    const unsealingInstructions = "Go to jail. Go directly to jail. Do not pass go. Do not collected $200."

    test('seal and unseal', async () => {
        var module = await SeededCryptoModulePromise;
        const unsealingKey = module.UnsealingKey.deriveFromSeed(seedString, derivationOptionsJson);
        const sealingKey = unsealingKey.getSealingKey();
        strictEqual(unsealingKey.derivationOptionsJson, derivationOptionsJson);
        strictEqual(sealingKey.sealingKeyBytes.length, 32);
        strictEqual(unsealingKey.unsealingKeyBytes.length, 32);
        strictEqual(sealingKey.derivationOptionsJson, derivationOptionsJson);
        const message = sealingKey.seal(plaintext, unsealingInstructions);
        strictEqual(message.derivationOptionsJson, derivationOptionsJson);
        strictEqual(message.unsealingInstructions, unsealingInstructions);
        const recoveredPlaintextBytes = unsealingKey.unseal(message);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        sealingKey.delete();
        unsealingKey.delete();
    });

    test('raw seal', async () => {
        var module = await SeededCryptoModulePromise;
        const unsealingKey = module.UnsealingKey.deriveFromSeed(seedString, derivationOptionsJson);
        const sealingKey = unsealingKey.getSealingKey();
        const ciphertext = sealingKey.sealToCiphertextOnly(plaintext, unsealingInstructions);
        const message = new module.PackagedSealedMessage(ciphertext, derivationOptionsJson, unsealingInstructions);
        const recoveredPlaintextBytes = unsealingKey.unseal(message);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        sealingKey.delete();
        unsealingKey.delete();
    });

    
    test('raw unseal', async () => {
        var module = await SeededCryptoModulePromise;
        const unsealingKey = module.UnsealingKey.deriveFromSeed(seedString, derivationOptionsJson);
        const sealingKey = unsealingKey.getSealingKey();
        const message = sealingKey.seal(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = unsealingKey.unsealCiphertext(message.ciphertext, message.unsealingInstructions);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        sealingKey.delete();
        unsealingKey.delete();
    });

    test('static unseal', async () => {
        var module = await SeededCryptoModulePromise;
        const unsealingKey = module.UnsealingKey.deriveFromSeed(seedString, derivationOptionsJson);
        const sealingKey = unsealingKey.getSealingKey();
        const message = sealingKey.seal(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = module.UnsealingKey.unseal(message, seedString);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        sealingKey.delete();
        unsealingKey.delete();
    });

    test('unseal from json', async () => {
        var module = await SeededCryptoModulePromise;
        const unsealingKey = module.UnsealingKey.deriveFromSeed(seedString, derivationOptionsJson);
        const sealingKey = unsealingKey.getSealingKey();
        const message = sealingKey.seal(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = unsealingKey.unsealJsonPackagedSealedMessage(message.toJson());
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        sealingKey.delete();
        unsealingKey.delete();
    });

    test('unseal from binary', async () => {
        var module = await SeededCryptoModulePromise;
        const unsealingKey = module.UnsealingKey.deriveFromSeed(seedString, derivationOptionsJson);
        const sealingKey = unsealingKey.getSealingKey();
        const message = sealingKey.seal(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = unsealingKey.unsealBinaryPackagedSealedMessage(message.toSerializedBinaryForm());
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    
    test('static unseal from json', async () => {
        var module = await SeededCryptoModulePromise;
        const unsealingKey = module.UnsealingKey.deriveFromSeed(seedString, derivationOptionsJson);
        const sealingKey = unsealingKey.getSealingKey();
        const message = sealingKey.seal(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = module.UnsealingKey.unsealJsonPackagedSealedMessage(message.toJson(), seedString);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    test('static unseal from binary', async () => {
        var module = await SeededCryptoModulePromise;
        const unsealingKey = module.UnsealingKey.deriveFromSeed(seedString, derivationOptionsJson);
        const sealingKey = unsealingKey.getSealingKey();
        const message = sealingKey.seal(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = module.UnsealingKey.unsealBinaryPackagedSealedMessage(message.toSerializedBinaryForm(), seedString);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });


});