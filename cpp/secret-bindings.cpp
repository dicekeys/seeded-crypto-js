#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"


EMSCRIPTEN_BINDINGS(Secret) {

  emscripten::class_<Secret>("Secret")
    AddSerializable(Secret)
    AddDirectlyDerivable(Secret)

    // export class Secret extends DerivedSecret {
    //   readonly sealingKeyBytes: Uint8Array;
    .property<emscripten::val>("secretBytes",
      [](const Secret &secret)->emscripten::val{
        return toJsUint8Array(secret.secretBytes);
    })
  ;
}

