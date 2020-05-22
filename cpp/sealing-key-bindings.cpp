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

    //   seal(message: BindableToString, unsealingInstructions: string): PackagedSealedMessage;
    .function("seal", emscripten::select_overload<const PackagedSealedMessage(const std::string&, const std::string&)const>(&SealingKey::seal))

    //   sealToCiphertextOnly(message: BindableToString, unsealingInstructions: string): Uint8Array;
    .function<emscripten::val>("sealToCiphertextOnly", *[](
        const SealingKey& sealingKey,
        const std::string& message,
        const std::string& unsealingInstructions = {}
      ) {
        sealingKey.sealToCiphertextOnly(message, unsealingInstructions);
      })
  ;
}

