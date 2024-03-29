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
    // JSObject serialzition
    .function("toJsObject", *[](const Secret &secret)->emscripten::val{
      auto obj = emscripten::val::object();
      obj.set("secretBytes", toJsUint8Array(secret.secretBytes));
      obj.set("recipe", secret.recipe);
      return obj;
    })
    .class_function<Secret>("fromJsObject", *[](const emscripten::val &jsObj)->Secret{
      const SodiumBuffer secretBytes = sodiumBufferFromJsTypedNumericArray(jsObj["secretBytes"]);
      const std::string recipe = jsObj["recipe"].as<std::string>();
      return Secret(secretBytes, recipe);
    });
}

