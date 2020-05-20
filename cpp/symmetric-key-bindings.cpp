#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"

inline emscripten::val symmetricUnseal(
  const SymmetricKey& symmetricKey, 
  const PackagedSealedMessage& packagedSealedMessage
) {
  return toJsUint8Array(symmetricKey.unseal(packagedSealedMessage));
}

inline emscripten::val symmetricUnsealJsonPackagedSealedMessage(
  SymmetricKey& symmetricKey,
  const std::string& packagedSealedMessageJson
) {
  return toJsUint8Array(
    symmetricKey.unseal(
      PackagedSealedMessage::fromJson(packagedSealedMessageJson)
      )
    );
}

inline emscripten::val staticSymmetricUnseal(
  const PackagedSealedMessage& packagedSealedMessage,
  const std::string& derivationOptions
) {
  return toJsUint8Array(
    SymmetricKey::unseal(packagedSealedMessage, derivationOptions)
  );
}

EMSCRIPTEN_BINDINGS(SymmetricKey) {

  emscripten::class_<SymmetricKey>("SymmetricKey")
    AddDerivablesSerliazable(SymmetricKey)
    .property<emscripten::val>("keyBytes",
      [](const SymmetricKey &symmetricKey)->emscripten::val{
        return toJsUint8Array(symmetricKey.keyBytes);
    })
    .function("seal", emscripten::select_overload<const PackagedSealedMessage(const std::string&, const std::string&)const>(&SymmetricKey::seal))
    .function("unseal", &symmetricUnseal)
    .function("unsealJsonPackagedSealedMessage", &symmetricUnsealJsonPackagedSealedMessage)
    .class_function("unseal", &staticSymmetricUnseal)
  ;
}

