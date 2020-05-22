#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"


EMSCRIPTEN_BINDINGS(SignatureVerificationKey) {

  emscripten::class_<SignatureVerificationKey>("SignatureVerificationKey")
    AddSerializable(SignatureVerificationKey)
    AddIndirectlyDerivable(SignatureVerificationKey)

    //   readonly SignatureVerificationKeyBytes: Uint8Array;
    .property<emscripten::val>("signatureVerificationKeyBytes",
      [](const SignatureVerificationKey &signatureVerificationKey)->emscripten::val{
        return toJsUint8Array(signatureVerificationKey.signatureVerificationKeyBytes);
    })


    //   verify(message: BindableToString, signature: TypedByteArray): boolean;
    .function("verify", *[](const SignatureVerificationKey& signatureVerificationKey,
        const std::string &message,
        const emscripten::val &signature
      ){
      return signatureVerificationKey.verify(
        message,
        byteVectorFromJsNumericArray(signature)
      );
    })
  ;
}

