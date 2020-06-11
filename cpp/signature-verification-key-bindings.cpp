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

    .function("toJsObject", *[](const SignatureVerificationKey &signatureVerificationKey)->emscripten::val{
      auto obj = emscripten::val::object();
      obj.set("signatureVerificationKeyBytes", toJsUint8Array(signatureVerificationKey.signatureVerificationKeyBytes));
      obj.set("derivationOptionsJson", signatureVerificationKey.derivationOptionsJson);
      return obj;
    })
    .class_function<SignatureVerificationKey>("fromJsObject", *[](const emscripten::val &jsObj)->SignatureVerificationKey{
      const std::vector<unsigned char> signatureVerificationKeyBytes = byteVectorFromJsNumericArray(jsObj["signatureVerificationKeyBytes"]);
      const std::string derivationOptionsJson = jsObj["derivationOptionsJson"].as<std::string>();
      return SignatureVerificationKey(signatureVerificationKeyBytes, derivationOptionsJson);
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

