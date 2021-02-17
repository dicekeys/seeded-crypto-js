import {
    SeededCryptoModulePromise,
} from "../seeded-crypto"
import { strictEqual } from "assert";
import { sign } from "crypto";

describe("SigningKey", () => {

    const seedString = "Avocado";
    const recipe = `{"HumorStyle": "Boomer"}`;
    const plaintext = "This seals the deal!";
    const unsealingInstructions = "Go to jail. Go directly to jail. Do not pass go. Do not collected $200."

    test('sign and verify', async () => {
        var module = await SeededCryptoModulePromise;
        const signingKey = module.SigningKey.deriveFromSeed(seedString, recipe);
        const signatureVerificationKey = signingKey.getSignatureVerificationKey();
        strictEqual(signingKey.recipe, recipe);
        strictEqual(signatureVerificationKey.signatureVerificationKeyBytes.length, 32);
        strictEqual(signingKey.signingKeyBytes.length, 64);
        strictEqual(signatureVerificationKey.recipe, recipe);
        const signature = signingKey.generateSignature(plaintext);
        const verified = signatureVerificationKey.verify(plaintext, signature);
        strictEqual(verified, true);
        signature[0]++
        strictEqual(signatureVerificationKey.verify(plaintext, signature), false);
        signatureVerificationKey.delete();
        signingKey.delete();
    });

    test('SigningKey to and from jsobject', async () => {
        var module = await SeededCryptoModulePromise;
        const signingKey = module.SigningKey.deriveFromSeed(seedString, recipe);

        const signingKeyCopy = module.SigningKey.fromJsObject(signingKey.toJsObject());
        expect(signingKeyCopy.recipe).toStrictEqual(signingKey.recipe);
        expect(signingKeyCopy.signingKeyBytes).toStrictEqual(signingKey.signingKeyBytes);
        expect(signingKeyCopy.signatureVerificationKeyBytes).toStrictEqual(signingKey.signatureVerificationKeyBytes);

        signingKey.delete();
    });

    test('SignatureVerificationKey to and from jsobject', async () => {
        var module = await SeededCryptoModulePromise;
        const signingKey = module.SigningKey.deriveFromSeed(seedString, recipe);
        const signatureVerificationKey = signingKey.getSignatureVerificationKey();
        
        const signatureVericationKeyCopy = module.SignatureVerificationKey.fromJsObject(signatureVerificationKey.toJsObject());
        expect(signatureVericationKeyCopy.recipe).toStrictEqual(signingKey.recipe);
        expect(signatureVericationKeyCopy.signatureVerificationKeyBytes).toStrictEqual(signingKey.signatureVerificationKeyBytes);

        signingKey.delete();
        signatureVerificationKey.delete();
    });



    test('raw sign and verify', async () => {
        var module = await SeededCryptoModulePromise;
        const signingKey = module.SigningKey.deriveFromSeed(seedString, recipe);
        const signatureVerificationKey = signingKey.getSignatureVerificationKey();
        const signature = module.SigningKey.generateSignature(plaintext, seedString, recipe);
        const verified = signatureVerificationKey.verify(plaintext, signature);
        strictEqual(verified, true);
        signature[0]++
        strictEqual(signatureVerificationKey.verify(plaintext, signature), false);
        signatureVerificationKey.delete();
        signingKey.delete();
    });


});