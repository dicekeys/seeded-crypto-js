import {
    SeededCryptoModulePromise,
} from "../seeded-crypto"
import { strictEqual, notStrictEqual } from "assert";

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

    test('Secret.derivationOptionsJson renamed Secret.recipeJson', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Secret.deriveFromSeed(seedString, derivationOptionsJson);
        expect(secret.derivationOptionsJson).toEqual(derivationOptionsJson);
        expect(secret.recipeJson).toEqual(derivationOptionsJson);
        const json = secret.toJson();
        const jsonObj = (JSON.parse(json) as {recipeJson?: String})
        expect (jsonObj.recipeJson).toEqual(derivationOptionsJson)
        const reconstituted = module.Secret.fromJson(json)
        expect (reconstituted.recipeJson).toEqual(secret.recipeJson)

    });

    test('to and from json', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Secret.deriveFromSeed(seedString, derivationOptionsJson);
        const copy = module.Secret.fromJson(secret.toJson())
        expect(copy.derivationOptionsJson).toEqual(secret.derivationOptionsJson);
        expect(copy.secretBytes).toEqual(secret.secretBytes);
        secret.delete();
    });
    
    test('to and from jsobject', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Secret.deriveFromSeed(seedString, derivationOptionsJson);
        const jsObject = secret.toJsObject();
        // console.log("Constructed the object:", jsObject)
        const copy = module.Secret.fromJsObject(jsObject);
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
        notStrictEqual(secret, oldSecret);
    });

    test('matches c++', async () => {
        var module = await SeededCryptoModulePromise;
        const passwordObj = module.Password.deriveFromSeed(
            "A1tB2rC3bD4lE5tF6bG1tH1tI1tJ1tK1tL1tM1tN1tO1tP1tR1tS1tT1tU1tV1tW1tX1tY1tZ1t", "{}"
        );
        const password = passwordObj.password;
        expect(password).toBe("15-Unwed-agent-genre-stump-could-limit-shrug-shout-udder-bring-koala-essay-plaza-chaos-clerk");
    });


});