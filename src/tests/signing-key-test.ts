import {
    SeededCryptoModulePromise,
} from "../seeded-crypto"
import { strictEqual } from "assert";

describe("SigningKey", () => {

    const seedString = "Avocado";
    const derivationOptionsJson = `{"HumorStyle": "Boomer"}`;
    const plaintext = "This seals the deal!";
    const unsealingInstructions = "Go to jail. Go directly to jail. Do not pass go. Do not collected $200."

    test('sign and verify', async () => {
        var module = await SeededCryptoModulePromise;
        const signingKey = module.SigningKey.deriveFromSeed(seedString, derivationOptionsJson);
        const signatureVerificationKey = signingKey.getSignatureVerificationKey();
        strictEqual(signingKey.derivationOptionsJson, derivationOptionsJson);
        strictEqual(signatureVerificationKey.signatureVerificationKeyBytes.length, 32);
        strictEqual(signingKey.signingKeyBytes.length, 64);
        strictEqual(signatureVerificationKey.derivationOptionsJson, derivationOptionsJson);
        const signature = signingKey.generateSignature(plaintext);
        const verified = signatureVerificationKey.verify(plaintext, signature);
        strictEqual(verified, true);
        signature[0]++
        strictEqual(signatureVerificationKey.verify(plaintext, signature), false);
        signatureVerificationKey.delete();
        signingKey.delete();
    });

    test('raw sign and verify', async () => {
        var module = await SeededCryptoModulePromise;
        const signingKey = module.SigningKey.deriveFromSeed(seedString, derivationOptionsJson);
        const signatureVerificationKey = signingKey.getSignatureVerificationKey();
        const signature = module.SigningKey.generateSignature(plaintext, seedString, derivationOptionsJson);
        const verified = signatureVerificationKey.verify(plaintext, signature);
        strictEqual(verified, true);
        signature[0]++
        strictEqual(signatureVerificationKey.verify(plaintext, signature), false);
        signatureVerificationKey.delete();
        signingKey.delete();
    });


});