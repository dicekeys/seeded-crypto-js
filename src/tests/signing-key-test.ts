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

        signingKey.delete();
    });

    test('SignatureVerificationKey to and from jsobject', async () => {
        var module = await SeededCryptoModulePromise;
        const signingKey = module.SigningKey.deriveFromSeed(seedString, recipe);
        const signatureVerificationKey = signingKey.getSignatureVerificationKey();
        
        const signatureVerificationKeyCopy = module.SignatureVerificationKey.fromJsObject(signatureVerificationKey.toJsObject());
        expect(signatureVerificationKeyCopy.recipe).toStrictEqual(signingKey.recipe);

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

    test('outputs', async () => {
        var module = await SeededCryptoModulePromise;
        const signingKey = module.SigningKey.deriveFromSeed(seedString, recipe);
        const signatureVerificationKey = signingKey.getSignatureVerificationKey();
        const openPgpPemFormatSecretKey = signingKey.toOpenPgpPemFormatSecretKey(
           "DK_USER_1 <dkuser1@dicekeys.org>", Math.floor(Date.now() / 1000)
        );        
        const openSshPemPrivateKey = signingKey.toOpenSshPemPrivateKey("comment");
        const openSshPublicKey = signingKey.toOpenSshPublicKey();
        const openSshPublicKeyConfirm = signatureVerificationKey.toOpenSshPublicKey();
        // console.log("USE ONLY TO VISUALIZE OUTPUT",
        // openPgpPemFormatSecretKey,
        // openSshPemPrivateKey,
        // openSshPublicKey,
        // openSshPublicKeyConfirm);
        expect(openSshPemPrivateKey).toBeDefined();
        expect(openPgpPemFormatSecretKey).toBeDefined()
        expect (openSshPublicKey).toStrictEqual(openSshPublicKeyConfirm);
    });


});