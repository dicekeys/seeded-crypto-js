#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"


EMSCRIPTEN_BINDINGS(Password) {

  emscripten::class_<Password>("Password")
    AddSerializable(Password)
    AddDirectlyDerivable(Password)
    .class_function("deriveFromSeedAndWordList", &Password::deriveFromSeedAndWordList)
    // export class Password extends DerivedPassword {
    //   readonly password: String;
    .property<std::string>("password", *[] \
    (const Password &password)->std::string{ return password.password; })
    // JSObject serialzition
    .function("toJsObject", *[](const Password &password)->emscripten::val{
      auto obj = emscripten::val::object();
      obj.set("password", password.password);
      obj.set("recipe", password.recipe);
      return obj;
    })
    .class_function<Password>("fromJsObject", *[](const emscripten::val &jsObj)->Password{
      const std::string password = jsObj["password"].as<std::string>();
      const std::string recipe = jsObj["recipe"].as<std::string>();
      return Password(password, recipe);
    });
}

