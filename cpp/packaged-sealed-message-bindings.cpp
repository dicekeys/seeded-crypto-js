#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"

inline PackagedSealedMessage* constructPackageSealedMessage(
  emscripten::val ciphertext,
  const std::string& derivationOptionsJson,
  const std::string& unsealingInstructions
) { return new PackagedSealedMessage(
      byteVectorFromJsNumericArray(ciphertext), derivationOptionsJson, unsealingInstructions);
}

EMSCRIPTEN_BINDINGS(PackagedSealedMessage) {
  
  emscripten::class_<PackagedSealedMessage>("PackagedSealedMessage")
    AddSerializable(PackagedSealedMessage)
    .constructor(&constructPackageSealedMessage, emscripten::allow_raw_pointers())
    // readonly ciphertext: Uint8Array;
    .property<emscripten::val>("ciphertext", [](const PackagedSealedMessage &psm){
      return toJsUint8Array(psm.ciphertext);
    })
    // readonly derivationOptionsJson: string;
    .property<std::string>("derivationOptionsJson", [](const PackagedSealedMessage &psm){
        return psm.derivationOptionsJson;
    })
    // readonly unsealingInstructions: string;
    .property<std::string>("unsealingInstructions", [](const PackagedSealedMessage &psm){
        return psm.unsealingInstructions;
    })
    ;
}

