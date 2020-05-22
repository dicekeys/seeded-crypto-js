#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"


EMSCRIPTEN_BINDINGS(SigningKey) {

  emscripten::class_<SigningKey>("SigningKey")
    AddSerializable(SigningKey)
    AddDirectlyDerivable(SigningKey)

    // export class SigningKey extends DerivedSecret {
    //   readonly sealingKeyBytes: Uint8Array;
    .property<emscripten::val>("signingKeyBytes",
      [](const SigningKey &signingKey)->emscripten::val{
        return toJsUint8Array(signingKey.signingKeyBytes);
    })

    //   readonly SigningKeyBytes: Uint8Array;
    .property<emscripten::val>("signatureVerificationKeyBytes",
      [](SigningKey &signingKey)->emscripten::val{
        return toJsUint8Array(signingKey.getSignatureVerificationKeyBytes());
    })

    //   getSignatureVerificationKey(): SignatureVerificationKey;
    .function("getSignatureVerificationKey", *[](SigningKey& signingKey){
      return signingKey.getSignatureVerificationKey();
    })

    //   generateSignature(message: BindableToString): Uint8Array
    .function("generateSignature", *[](SigningKey& signingKey, const std::string& message){
      return signingKey.generateSignature((const unsigned char*) message.data(), message.size());
    })

    //   generateSignature(message: BindableToString, seedString: string, derivationOptionsJson: string): Uint8Array;
    .class_function("generateSignature", *[](
        const std::string& message,
        const std::string& seedString,
        const std::string& derivationOptionsJson){
      return SigningKey::deriveFromSeed(seedString, derivationOptionsJson)
        .generateSignature((const unsigned char*) message.data(), message.size());
    })
  ;
}

