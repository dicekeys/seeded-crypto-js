import {
    SeededCryptoModulePromise,
} from "../seeded-crypto"
import { strictEqual, notEqual } from "assert";

describe("Secret", () => {

    const seedString = "Avocado";
    const derivationOptionsJson = `{"lengthInBytes": 64}`;
    const plaintext = "This seals the deal!";
    const unsealingInstructions = "Go to jail. Go directly to jail. Do not pass go. Do not collected $200."

    test('generate', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Secret.deriveFromSeed(seedString, derivationOptionsJson);
        strictEqual(secret.derivationOptionsJson, derivationOptionsJson);
        strictEqual(secret.secretBytes.length, 64);
        secret.delete();
    });

    test('to and from binary form', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Secret.deriveFromSeed(seedString, derivationOptionsJson);
        const copy = module.Secret.fromSerializedBinaryForm(secret.toSerializedBinaryForm())
        expect(copy.derivationOptionsJson).toEqual(secret.derivationOptionsJson);
        expect(copy.secretBytes).toEqual(secret.secretBytes);
        secret.delete();
    });

    test('to and from json', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Secret.deriveFromSeed(seedString, derivationOptionsJson);
        const copy = module.Secret.fromJson(secret.toJson())
        expect(copy.derivationOptionsJson).toEqual(secret.derivationOptionsJson);
        expect(copy.secretBytes).toEqual(secret.secretBytes);
        secret.delete();
    });

    test('to and from custom json', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Secret.deriveFromSeed(seedString, derivationOptionsJson);
        const copy = module.Secret.fromJson(secret.toCustomJson(2, "\t".charCodeAt(0)))
        expect(copy.derivationOptionsJson).toEqual(secret.derivationOptionsJson);
        expect(copy.secretBytes).toEqual(secret.secretBytes);
        secret.delete();
    });

    test('use argon2', async () => {
        var module = await SeededCryptoModulePromise;
        const oldSecret = module.Secret.deriveFromSeed(seedString, derivationOptionsJson);
        //                 "hashFunctionMemoryLimitInBytes": 8196,
        const secret = module.Secret.deriveFromSeed(seedString, `
            {
                "hashFunction": "Argon2id",
                "lengthInBytes": 64
            }
        `.trim());
        notEqual(secret, oldSecret);
    });


});