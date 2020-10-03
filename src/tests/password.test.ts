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
        expect(copy.password).toEqual(secret.password);
        secret.delete();
    });

    test('to and from json', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Password.deriveFromSeed(seedString, derivationOptionsJson);
        const copy = module.Password.fromJson(secret.toJson())
        expect(copy.derivationOptionsJson).toEqual(secret.derivationOptionsJson);
        expect(copy.password).toEqual(secret.password);
        secret.delete();
    });
    
    test('to and from jsobject', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Password.deriveFromSeed(seedString, derivationOptionsJson);
        const jsObject = secret.toJsObject();
        // console.log("Constructed the object:", jsObject)
        const copy = module.Password.fromJsObject(jsObject);
        expect(copy.derivationOptionsJson).toEqual(secret.derivationOptionsJson);
        expect(copy.password).toEqual(secret.password);
        secret.delete();
    });


    test('to and from custom json', async () => {
        var module = await SeededCryptoModulePromise;
        const secret = module.Password.deriveFromSeed(seedString, derivationOptionsJson);
        const copy = module.Password.fromJson(secret.toCustomJson(2, "\t".charCodeAt(0)))
        expect(copy.derivationOptionsJson).toEqual(secret.derivationOptionsJson);
        expect(copy.password).toEqual(secret.password);
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


    const orderedTestKey = "A1tB2rC3bD4lE5tF6bG1tH1tI1tJ1tK1tL1tM1tN1tO1tP1tR1tS1tT1tU1tV1tW1tX1tY1tZ1t";

    test('GeneratesExtraBytes', async () => {
        var module = await SeededCryptoModulePromise;
	    const password = module.Password.deriveFromSeed(orderedTestKey, `{
	"lengthInBits": 300
}`);

	const pw = password.password;
	const serialized = password.toSerializedBinaryForm();
	const replica = module.Password.fromSerializedBinaryForm(serialized);
    const rpw = replica.password;
    expect(rpw).toBe(pw);
    expect(pw.substr(0,3)).toBe("34-");
});

    test('TenWordsViaLengthInBits', async () => {
        var module = await SeededCryptoModulePromise;
	    const password = module.Password.deriveFromSeed(orderedTestKey, `{
	"type": "Password",
	"lengthInBits": 90
}`);

        const pw = password.password;
        expect(pw).toBe("10-Ionic-buzz-shine-theme-paced-bulge-cache-water-shown-baggy");
    });

    test('ElevenWordsViaLengthInWords', async () => {
        var module = await SeededCryptoModulePromise;
	    const password = module.Password.deriveFromSeed(orderedTestKey, `{
	"type": "Password",
	"lengthInWords": 11
}`);

	const pw = password.password;
	expect(pw).toBe("11-Clean-snare-donor-petty-grimy-payee-limbs-stole-roman-aloha-dense");
})


    test('ThirteenWordsViaDefaultWithAltWordList', async () => {
        var module = await SeededCryptoModulePromise;
	    const password = module.Password.deriveFromSeed(orderedTestKey, `{
	"wordList": "EN_1024_words_6_chars_max_ed_4_20200917"
}`);

	const pw = password.password;
	expect(pw).toBe("13-Curtsy-jersey-juror-anchor-catsup-parole-kettle-floral-agency-donor-dealer-plural-accent");
});


    test('FifteenWordsViaDefaults', async () => {
        var module = await SeededCryptoModulePromise;
	    const password = module.Password.deriveFromSeed(orderedTestKey, `{}`);

	const pw = password.password;
	expect(pw).toBe("15-Unwed-agent-genre-stump-could-limit-shrug-shout-udder-bring-koala-essay-plaza-chaos-clerk");
});


    test('CustomListOfSevenWords', async () => {
        var module = await SeededCryptoModulePromise;
	const password = module.Password.deriveFromSeedAndWordList(orderedTestKey, `{"lengthInWords": 10}`, `
            yo
            llama,
            delimits,this
            prime${"\t"}
            sized\
            list
        `);
        const pw = password.password;
        expect(pw).toBe("10-This-yo-yo-this-delimits-sized-list-list-this-llama");
    });



});