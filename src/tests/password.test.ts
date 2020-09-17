import {
    SeededCryptoModulePromise,
} from "../seeded-crypto"
import { strictEqual, notStrictEqual } from "assert";

describe("Password", () => {

    const seedString = "Avocado";
    const derivationOptionsJson = `{}`;
    const plaintext = "This seals the deal!";
    const unsealingInstructions = "Go to jail. Go directly to jail. Do not pass go. Do not collected $200."

    test('generate', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Password.deriveFromSeed(seedString, derivationOptionsJson);
        strictEqual(secret.derivationOptionsJson, derivationOptionsJson);
        secret.delete();
    });

    test('to and from binary form', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Password.deriveFromSeed(seedString, derivationOptionsJson);
        const copy = module.Password.fromSerializedBinaryForm(secret.toSerializedBinaryForm())
        expect(copy.derivationOptionsJson).toEqual(secret.derivationOptionsJson);
        expect(copy.secretBytes).toEqual(secret.secretBytes);
        secret.delete();
    });

    test('to and from json', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Password.deriveFromSeed(seedString, derivationOptionsJson);
        const copy = module.Password.fromJson(secret.toJson())
        expect(copy.derivationOptionsJson).toEqual(secret.derivationOptionsJson);
        expect(copy.secretBytes).toEqual(secret.secretBytes);
        secret.delete();
    });
    
    test('to and from jsobject', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Password.deriveFromSeed(seedString, derivationOptionsJson);
        const jsObject = secret.toJsObject();
        // console.log("Constructed the object:", jsObject)
        const copy = module.Password.fromJsObject(jsObject);
        expect(copy.derivationOptionsJson).toEqual(secret.derivationOptionsJson);
        expect(copy.secretBytes).toEqual(secret.secretBytes);
        secret.delete();
    });


    test('to and from custom json', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Password.deriveFromSeed(seedString, derivationOptionsJson);
        const copy = module.Password.fromJson(secret.toCustomJson(2, "\t".charCodeAt(0)))
        expect(copy.derivationOptionsJson).toEqual(secret.derivationOptionsJson);
        expect(copy.secretBytes).toEqual(secret.secretBytes);
        secret.delete();
    });

    test('use argon2', async () => {
        var module = await SeededCryptoModulePromise;
        const oldPassword = module.Password.deriveFromSeed(seedString, derivationOptionsJson);
        //                 "hashFunctionMemoryLimitInBytes": 8196,
        const secret = module.Password.deriveFromSeed(seedString, `
            {
                "hashFunction": "Argon2id",
                "lengthInBytes": 64
            }
        `.trim());
        notStrictEqual(secret, oldPassword);
    });


});