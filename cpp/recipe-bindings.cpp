#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"


EMSCRIPTEN_BINDINGS(Recipe) {  

  emscripten::class_<Recipe>("Recipe")
    .class_function<emscripten::val>("derivePrimarySecret", *[](
        const std::string &seedString,
        const std::string &recipe
      )->emscripten::val{
       // return emscripten::val(seedString + recipe);
        // const auto buf = Recipe::derivePrimarySecret(seedString, recipe);
        // return emscripten::val("0123456789012345678901234567890123456789012345678901234567890123");
        return toJsUint8Array( Recipe::derivePrimarySecret(seedString, recipe) );
      });
}
