#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"


EMSCRIPTEN_BINDINGS(SealingKey) {

  emscripten::class_<SealingKey>("SealingKey")
    AddSerializable(SealingKey)
    AddIndirectlyDerivable(SealingKey)

    // export class SealingKey extends DerivedSecret {
    //   readonly sealingKeyBytes: Uint8Array;
    .property<emscripten::val>("sealingKeyBytes",
      [](const SealingKey &sealingKey)->emscripten::val{
        return toJsUint8Array(sealingKey.sealingKeyBytes);
    })

    .function("toJsObject", *[](const SealingKey &sealingKey)->emscripten::val{
      auto obj = emscripten::val::object();
      obj.set("sealingKeyBytes", toJsUint8Array(sealingKey.sealingKeyBytes));
      obj.set("recipe", sealingKey.recipe);
      return obj;
    })
    .class_function<SealingKey>("fromJsObject", *[](const emscripten::val &jsObj)->SealingKey{
      const std::vector<unsigned char> sealingKeyBytes = byteVectorFromJsNumericArray(jsObj["sealingKeyBytes"]);
      const std::string recipe = jsObj["recipe"].as<std::string>();
      return SealingKey(sealingKeyBytes, recipe);
    })
    .class_function<SealingKey>("deriveFromSeed", *[](
      const std::string &seedString,
      const std::string& recipe
    )->SealingKey{
      return UnsealingKey::deriveFromSeed(seedString,recipe).getSealingKey();
    })

    //   sealWithInstructions(message: BindableToString, unsealingInstructions: string): PackagedSealedMessage;
    .function("sealWithInstructions", emscripten::select_overload<const PackagedSealedMessage(const std::string&, const std::string&)const>(&SealingKey::seal))

    //   seal(message: BindableToString): PackagedSealedMessage;
    .function("seal", *[](
        const SealingKey& sealingKey,
        const std::string& message
      )->PackagedSealedMessage {
        return sealingKey.seal(message);
      })

    //   sealToCiphertextOnly(message: BindableToString, unsealingInstructions: string): Uint8Array;
    .function("sealToCiphertextOnlyWithInstructions", *[](
        const SealingKey& sealingKey,
        const std::string& message,
        const std::string& unsealingInstructions
      ) {
        return toJsUint8Array(sealingKey.sealToCiphertextOnly(message, unsealingInstructions));
      })


    //   sealToCiphertextOnly(message: BindableToString, unsealingInstructions: string): Uint8Array;
    .function("sealToCiphertextOnly", *[](
        const SealingKey& sealingKey,
        const std::string& message
      ) {
        return toJsUint8Array(sealingKey.sealToCiphertextOnly(message));
      })
  ;
}

