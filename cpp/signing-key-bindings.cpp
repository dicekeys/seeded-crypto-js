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

    //   readonly signatureVerificationKeyBytes: Uint8Array;
    .property<emscripten::val>("signatureVerificationKeyBytes",
      [](const SigningKey &signingKey)->emscripten::val{
        return toJsUint8Array(((SigningKey&)signingKey).getSignatureVerificationKeyBytes());
    })

    
    .function("toJsObject", *[](const SigningKey &signingKey)->emscripten::val{
      auto obj = emscripten::val::object();
      obj.set("signingKeyBytes", toJsUint8Array(signingKey.signingKeyBytes));
      obj.set("signatureVerificationKeyBytes", toJsUint8Array(((SigningKey&)signingKey).getSignatureVerificationKeyBytes()));
      obj.set("recipe", signingKey.recipe);
      return obj;
    })
    .class_function<SigningKey>("fromJsObject", *[](const emscripten::val &jsObj)->SigningKey{
      const SodiumBuffer signingKeyBytes = sodiumBufferFromJsTypedNumericArray(jsObj["signingKeyBytes"]);
      const std::string recipe = jsObj["recipe"].as<std::string>();
      return SigningKey(signingKeyBytes, recipe);
    })

    //   getSignatureVerificationKey(): SignatureVerificationKey;
    .function("getSignatureVerificationKey", *[](SigningKey& signingKey){
      return signingKey.getSignatureVerificationKey();
    })

    //   generateSignature(message: BindableToString): Uint8Array
    .function("generateSignature", *[](SigningKey& signingKey, const std::string& message){
      return toJsUint8Array(signingKey.generateSignature((const unsigned char*) message.data(), message.size()));
    })

    //   generateSignature(message: BindableToString, seedString: string, recipe: string): Uint8Array;
    .class_function("generateSignature", *[](
        const std::string& message,
        const std::string& seedString,
        const std::string& recipe){
        return toJsUint8Array(
          SigningKey::deriveFromSeed(seedString, recipe)
            .generateSignature((const unsigned char*) message.data(), message.size())
        );
    })

    .function("toOpenSshPemPrivateKey", *[](SigningKey& signingKey, const std::string& comment){
      return signingKey.toOpenSshPemPrivateKey(comment);
    })
    .function("toOpenSshPublicKey", *[](SigningKey& signingKey){
      return signingKey.toOpenSshPublicKey();
    })
    .function("toOpenPgpPemFormatSecretKey", *[](SigningKey& signingKey, const std::string& userIdPacketContent, unsigned int timestamp){
      return signingKey.toOpenPgpPemFormatSecretKey(userIdPacketContent, timestamp);
    })


  ;
}

