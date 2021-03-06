import {
    SeededCryptoModulePromise,
} from "../seeded-crypto"
import { strictEqual, notStrictEqual } from "assert";

describe("Secret", () => {

    const seedString = "Avocado";
    const recipe = `{"lengthInBytes": 64}`;
    const plaintext = "This seals the deal!";
    const unsealingInstructions = "Go to jail. Go directly to jail. Do not pass go. Do not collected $200."

    test('generate', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Secret.deriveFromSeed(seedString, recipe);
        strictEqual(secret.recipe, recipe);
        strictEqual(secret.secretBytes.length, 64);
        secret.delete();
    });

    test('to and from binary form', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Secret.deriveFromSeed(seedString, recipe);
        const copy = module.Secret.fromSerializedBinaryForm(secret.toSerializedBinaryForm())
        expect(copy.recipe).toEqual(secret.recipe);
        expect(copy.secretBytes).toEqual(secret.secretBytes);
        secret.delete();
    });

    test('Secret.recipe renamed Secret.recipe', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Secret.deriveFromSeed(seedString, recipe);
        expect(secret.recipe).toEqual(recipe);
        expect(secret.recipe).toEqual(recipe);
        const json = secret.toJson();
        const jsonObj = (JSON.parse(json) as {recipe?: String})
        expect (jsonObj.recipe).toEqual(recipe)
        const reconstituted = module.Secret.fromJson(json)
        expect (reconstituted.recipe).toEqual(secret.recipe)

    });

    test('to and from json', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Secret.deriveFromSeed(seedString, recipe);
        const copy = module.Secret.fromJson(secret.toJson())
        expect(copy.recipe).toEqual(secret.recipe);
        expect(copy.secretBytes).toEqual(secret.secretBytes);
        secret.delete();
    });
    
    test('to and from jsobject', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Secret.deriveFromSeed(seedString, recipe);
        const jsObject = secret.toJsObject();
        // console.log("Constructed the object:", jsObject)
        const copy = module.Secret.fromJsObject(jsObject);
        expect(copy.recipe).toEqual(secret.recipe);
        expect(copy.secretBytes).toEqual(secret.secretBytes);
        secret.delete();
    });


    test('to and from custom json', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Secret.deriveFromSeed(seedString, recipe);
        const copy = module.Secret.fromJson(secret.toCustomJson(2, "\t".charCodeAt(0)))
        expect(copy.recipe).toEqual(secret.recipe);
        expect(copy.secretBytes).toEqual(secret.secretBytes);
        secret.delete();
    });

    test('use argon2', async () => {
        var module = await SeededCryptoModulePromise;
        const oldSecret = module.Secret.deriveFromSeed(seedString, recipe);
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