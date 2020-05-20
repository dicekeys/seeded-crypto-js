import {
    SeededCryptoModulePromise,
    SymmetricKey    
} from "../seeded-crypto"
import { strictEqual } from "assert";

test("Got jest?", () => {
    expect(true);
})

describe("SymmetricKey", () => {

    test('SymmetricKey', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed("yo", "");
        const plaintext = "perchance to SCREAM!";
        const message = symmetricKey.seal("perchance to SCREAM!", "");
        const recoveredPlaintextBytes = symmetricKey.unseal(message);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(plaintext, recoveredPlaintext);
        // console.log("key as json", key.toJson());
        // console.log("key as json", key.toCustomJson(2, "\t".charCodeAt(0)));
        // console.log("key bytes", key.keyBytes);
    });




});