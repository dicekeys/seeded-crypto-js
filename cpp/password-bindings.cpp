#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"


EMSCRIPTEN_BINDINGS(Password) {

  emscripten::class_<Password>("Password")
    AddSerializable(Password)
    AddDirectlyDerivable(Password)

    // export class Password extends DerivedPassword {
    //   readonly sealingKeyBytes: Uint8Array;
    .property<emscripten::val>("secretBytes",
      [](const Password &password)->emscripten::val{
        return toJsUint8Array(password.secretBytes);
    })
    .function("password", &Password::password)
    // JSObject serialzition
    .function("toJsObject", *[](const Password &password)->emscripten::val{
      auto obj = emscripten::val::object();
      obj.set("secretBytes", toJsUint8Array(password.secretBytes));
      obj.set("derivationOptionsJson", password.derivationOptionsJson);
      return obj;
    })
    .class_function<Password>("fromJsObject", *[](const emscripten::val &jsObj)->Password{
      const SodiumBuffer secretBytes = sodiumBufferFromJsTypedNumericArray(jsObj["secretBytes"]);
      const std::string derivationOptionsJson = jsObj["derivationOptionsJson"].as<std::string>();
      return Password(secretBytes, derivationOptionsJson);
    });
}

