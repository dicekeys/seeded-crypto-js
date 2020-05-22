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
    //   readonly signingKeyBytes: Uint8Array;
    .property<emscripten::val>("signingKeyBytes",
      [](const SigningKey &signingKey)->emscripten::val{
        return toJsUint8Array(signingKey.signingKeyBytes);
    })

    //   readonly singatureVerificationKeyBytes: Uint8Array;
    .property<emscripten::val>("signatureVerificationKeyBytes",
      [](const SigningKey &signingKey)->emscripten::val{
        return toJsUint8Array(((SigningKey&)signingKey).getSignatureVerificationKeyBytes());
    })

    //   getSignatureVerificationKey(): SignatureVerificationKey;
    .function("getSignatureVerificationKey", *[](SigningKey& signingKey){
      return signingKey.getSignatureVerificationKey();
    })

    //   generateSignature(message: BindableToString): Uint8Array
    .function("generateSignature", *[](SigningKey& signingKey, const std::string& message){
      return toJsUint8Array(signingKey.generateSignature((const unsigned char*) message.data(), message.size()));
    })

    //   generateSignature(message: BindableToString, seedString: string, derivationOptionsJson: string): Uint8Array;
    .class_function("generateSignature", *[](
        const std::string& message,
        const std::string& seedString,
        const std::string& derivationOptionsJson){
        return toJsUint8Array(
          SigningKey::deriveFromSeed(seedString, derivationOptionsJson)
            .generateSignature((const unsigned char*) message.data(), message.size())
        );
    })
  ;
}

