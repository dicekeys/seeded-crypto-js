import {
    SeededCryptoModulePromise,
} from "../seeded-crypto"

describe("Recipe", () => {

    const seedString = "Avocado";
    const recipe = `{"lengthInBytes": 64}`;

    test('derivePrimarySecret', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Recipe.derivePrimarySecret(seedString, recipe);
        expect(secret.length).toBe(64);
    });

});