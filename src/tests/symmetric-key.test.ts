/**
 * @jest-environment node
 */
import {
    SeededCryptoModulePromise,
} from "../seeded-crypto"
import {TextDecoder} from "util";
import { strictEqual } from "assert";

describe("SymmetricKey", () => {

    const seedString = "yo";
    const derivationOptionsJson = `{"ValidJson": "This time!"}`;
    const plaintext = "perchance to SCREAM!";
    const plaintextBuffer = Buffer.from(plaintext, 'utf-8');
    const unsealingInstructions = "run, do not walk, to the nearest cliche."

    test('seal and unseal with instructions', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        strictEqual(derivationOptionsJson, symmetricKey.derivationOptionsJson);
        const keyBytes = symmetricKey.keyBytes;
        strictEqual(keyBytes.length, 32);
        const message = symmetricKey.sealWithInstructions(plaintext, unsealingInstructions);
        strictEqual(message.derivationOptionsJson, derivationOptionsJson);
        strictEqual(message.unsealingInstructions, unsealingInstructions);
        const recoveredPlaintextBytes = symmetricKey.unseal(message);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        symmetricKey.delete();
        // console.log("key as json", key.toJson());
        // console.log("key as json", key.toCustomJson(2, "\t".charCodeAt(0)));
        // console.log("key bytes", key.keyBytes);
    });

    test('to and from jsobject', async () => {
        var module = await SeededCryptoModulePromise;
        const symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);

        const symmetricKeyCopy = module.SymmetricKey.fromJsObject(symmetricKey.toJsObject());
        expect(symmetricKeyCopy.derivationOptionsJson).toStrictEqual(symmetricKey.derivationOptionsJson);
        expect(symmetricKeyCopy.keyBytes).toStrictEqual(symmetricKey.keyBytes);

        symmetricKey.delete();
    });

    test('packagedSealedMessage and from jsobject', async () => {
        var module = await SeededCryptoModulePromise;
        const symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const psm = symmetricKey.sealWithInstructions(plaintextBuffer, unsealingInstructions);
  
        const psmCopy = module.PackagedSealedMessage.fromJsObject(psm.toJsObject());
        expect(psmCopy.derivationOptionsJson).toStrictEqual(psm.derivationOptionsJson);
        expect(psmCopy.unsealingInstructions).toStrictEqual(psm.unsealingInstructions);
        expect(psmCopy.ciphertext).toStrictEqual(psm.ciphertext);

        symmetricKey.delete();
        psm.delete();
    });
    
    test("Packaged sealed message to json and back", async () => {
      var module = await SeededCryptoModulePromise;
      var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
      const psm = symmetricKey.sealWithInstructions(plaintextBuffer, unsealingInstructions);
      const psmJson = psm.toJson();
      const psmCopy = module.PackagedSealedMessage.fromJson(psmJson);
      const recoveredPlaintextBytes = symmetricKey.unseal(psmCopy);
      const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
      strictEqual(recoveredPlaintext, plaintext);
      symmetricKey.delete();
    });

    test("Packaged sealed message to binary and back", async () => {
      var module = await SeededCryptoModulePromise;
      var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
      const psm = symmetricKey.sealWithInstructions(plaintextBuffer, unsealingInstructions);
      const psmBinary = psm.toSerializedBinaryForm();
      const psmCopy = module.PackagedSealedMessage.fromSerializedBinaryForm(psmBinary);
      const recoveredPlaintextBytes = symmetricKey.unseal(psmCopy);
      const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
      strictEqual(recoveredPlaintext, plaintext);
      symmetricKey.delete();
    });


    test("Failed case in api", async () => {
      var seededCryptoModule = await SeededCryptoModulePromise;
      const derivationOptionsJson = "{}";
      const testMessage = "The secret ingredient is dihydrogen monoxide";
      const plaintext = Buffer.from(testMessage, 'utf-8');
      const psm = seededCryptoModule.SymmetricKey.sealWithInstructions(
        plaintext,
        "",
        "A1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1tA1t",
        derivationOptionsJson
      );
      expect(psm.derivationOptionsJson).toBe(derivationOptionsJson);
      psm.delete();
    });

    test('seal and unseal using buffer', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.sealWithInstructions(plaintextBuffer, unsealingInstructions);
        const recoveredPlaintextBytes = symmetricKey.unseal(message);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        symmetricKey.delete();
        // console.log("key as json", key.toJson());
        // console.log("key as json", key.toCustomJson(2, "\t".charCodeAt(0)));
        // console.log("key bytes", key.keyBytes);
    });

    test('seal and unseal using Uint8Array', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const plaintextUint8Array = Uint8Array.from(plaintextBuffer);
        const message = symmetricKey.sealWithInstructions(plaintextUint8Array, unsealingInstructions);
        const recoveredPlaintextBytes = symmetricKey.unseal(message);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        symmetricKey.delete();
        // console.log("key as json", key.toJson());
        // console.log("key as json", key.toCustomJson(2, "\t".charCodeAt(0)));
        // console.log("key bytes", key.keyBytes);
    });

    test('seal no instructions and static unseal', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        strictEqual(derivationOptionsJson, symmetricKey.derivationOptionsJson);
        const keyBytes = symmetricKey.keyBytes;
        strictEqual(keyBytes.length, 32);
        const message = symmetricKey.seal(plaintext);
        strictEqual(message.derivationOptionsJson, derivationOptionsJson);
        strictEqual(message.unsealingInstructions, "");
        const recoveredPlaintextBytes = module.SymmetricKey.unseal(message, seedString);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        symmetricKey.delete();
    });

    test('raw seal', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        strictEqual(derivationOptionsJson, symmetricKey.derivationOptionsJson);
        const ciphertext = symmetricKey.sealToCiphertextOnly(plaintext);
        const message = new module.PackagedSealedMessage(ciphertext, derivationOptionsJson, "");
        strictEqual(message.derivationOptionsJson, derivationOptionsJson);
        strictEqual(message.unsealingInstructions, "");
        const recoveredPlaintextBytes = symmetricKey.unseal(message);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        symmetricKey.delete();
    });

    test('raw seal with instructions', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        strictEqual(derivationOptionsJson, symmetricKey.derivationOptionsJson);
        const ciphertext = symmetricKey.sealToCiphertextOnlyWithInstructions(plaintext, unsealingInstructions);
        const message = new module.PackagedSealedMessage(ciphertext, derivationOptionsJson, unsealingInstructions);
        strictEqual(message.derivationOptionsJson, derivationOptionsJson);
        strictEqual(message.unsealingInstructions, unsealingInstructions);
        const recoveredPlaintextBytes = symmetricKey.unseal(message);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
        symmetricKey.delete();
    });

    
    test('raw unseal', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.sealWithInstructions(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = symmetricKey.unsealCiphertext(message.ciphertext, message.unsealingInstructions);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    test('static unseal', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.sealWithInstructions(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = module.SymmetricKey.unseal(message, seedString);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    test('unseal from json', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.sealWithInstructions(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = symmetricKey.unsealJsonPackagedSealedMessage(message.toJson());
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    test('unseal from binary', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.sealWithInstructions(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = symmetricKey.unsealBinaryPackagedSealedMessage(message.toSerializedBinaryForm());
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        expect(recoveredPlaintext).toStrictEqual(plaintext);
        strictEqual(recoveredPlaintext, plaintext);
    });

    
    test('static unseal from json', async () => {
        var module = await SeededCryptoModulePromise;
        var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
        const message = symmetricKey.sealWithInstructions(plaintext, unsealingInstructions);
        const recoveredPlaintextBytes = module.SymmetricKey.unsealJsonPackagedSealedMessage(message.toJson(), seedString);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        expect(recoveredPlaintext).toStrictEqual(plaintext);
        strictEqual(recoveredPlaintext, plaintext);
    });

    test('static unseal from binary', async () => {
        var module = await SeededCryptoModulePromise;
        var message = module.SymmetricKey.sealWithInstructions(plaintext, unsealingInstructions, seedString, derivationOptionsJson);
        const recoveredPlaintextBytes = module.SymmetricKey.unsealBinaryPackagedSealedMessage(message.toSerializedBinaryForm(), seedString);
        const recoveredPlaintext = new TextDecoder("utf-8").decode(recoveredPlaintextBytes);
        strictEqual(recoveredPlaintext, plaintext);
    });

    test('seal empty plaintext', async () => {
      var module = await SeededCryptoModulePromise;
      var symmetricKey = module.SymmetricKey.deriveFromSeed(seedString, derivationOptionsJson);
      const emptyPlaintextUint8Array = Uint8Array.from([]);
      try {
        symmetricKey.sealWithInstructions(emptyPlaintextUint8Array, unsealingInstructions);
      } catch (e) {
        if (typeof e === "number") {
          const message = module.getExceptionMessage(e);
          // console.log("Message", message);
          if (typeof message !== "string" || message.toLocaleLowerCase().indexOf("invalid") === -1) {
            throw new Error(message);
          }
        } else {
          throw (e);
        }
      }
      expect(() => symmetricKey.sealWithInstructions(emptyPlaintextUint8Array, unsealingInstructions)).toThrow();
    });

});