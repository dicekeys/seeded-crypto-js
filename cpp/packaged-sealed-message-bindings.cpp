#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"

// export class PackagedSealedMessage extends SealedCryptoSerializableObject {

// constructor(ciphertext: TypedByteArray, recipe: string, unsealingInstructions: string)
inline PackagedSealedMessage* constructPackageSealedMessage(
  emscripten::val ciphertext,
  const std::string& recipe,
  const std::string& unsealingInstructions
) { return new PackagedSealedMessage(
      byteVectorFromJsNumericArray(ciphertext), recipe, unsealingInstructions);
}

EMSCRIPTEN_BINDINGS(PackagedSealedMessage) {
  
  emscripten::class_<PackagedSealedMessage>("PackagedSealedMessage")
    AddSerializable(PackagedSealedMessage)
    // constructor(ciphertext: TypedByteArray, recipe: string, unsealingInstructions: string)
    .constructor(&constructPackageSealedMessage, emscripten::allow_raw_pointers())
    // readonly ciphertext: Uint8Array;
    .property<emscripten::val>("ciphertext", [](const PackagedSealedMessage &psm){
        return toJsUint8Array(psm.ciphertext);
    })
    // readonly recipe: string;
    .property<std::string>("recipe", [](const PackagedSealedMessage &psm){
        return psm.recipe;
    })
    // readonly unsealingInstructions: string;
    .property<std::string>("unsealingInstructions", [](const PackagedSealedMessage &psm){
        return psm.unsealingInstructions;
    })

    .function("toJsObject", *[](const PackagedSealedMessage &packagedSealedMessage)->emscripten::val{
      auto obj = emscripten::val::object();
      obj.set("ciphertext", toJsUint8Array(packagedSealedMessage.ciphertext));
      obj.set("recipe", packagedSealedMessage.recipe);
      obj.set("unsealingInstructions", packagedSealedMessage.unsealingInstructions);
      return obj;
    })
    .class_function<PackagedSealedMessage>("fromJsObject", *[](const emscripten::val &jsObj)->PackagedSealedMessage{
      const std::vector<unsigned char> ciphertext = byteVectorFromJsNumericArray(jsObj["ciphertext"]);
      const std::string recipe = jsObj["recipe"].as<std::string>();
      const std::string unsealingInstructions = jsObj["unsealingInstructions"].as<std::string>();
      return PackagedSealedMessage(ciphertext, recipe, unsealingInstructions);
    })

    ;
}

// }