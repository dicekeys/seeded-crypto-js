import {
    SeededCryptoModulePromise,
} from "../seeded-crypto"
import { strictEqual, notEqual } from "assert";

describe("DerivationOptions", () => {

    const seedString = "Avocado";
    const derivationOptionsJson = `{"lengthInBytes": 64}`;

    test('derivePrimarySecret', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.DerivationOptions.derivePrimarySecret(seedString, derivationOptionsJson);
        expect(secret.length).toBe(64);
    });

});