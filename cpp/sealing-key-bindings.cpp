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

