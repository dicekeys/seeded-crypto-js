#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"


EMSCRIPTEN_BINDINGS(DerivationOptions) {  

  emscripten::class_<DerivationOptions>("DerivationOptions")
    .class_function<emscripten::val>("derivePrimarySecret", *[](
        const std::string &seedString,
        const std::string &derivationOptionsJson
      )->emscripten::val{
       // return emscripten::val(seedString + derivationOptionsJson);
        // const auto buf = DerivationOptions::derivePrimarySecret(seedString, derivationOptionsJson);
        // return emscripten::val("0123456789012345678901234567890123456789012345678901234567890123");
        return toJsUint8Array( DerivationOptions::derivePrimarySecret(seedString, derivationOptionsJson) );
      });
}
