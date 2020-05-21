#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"

// inline emscripten::val symmetricUnseal(
//   const SymmetricKey& symmetricKey, 
//   const PackagedSealedMessage& packagedSealedMessage
// ) {
//   return toJsUint8Array(symmetricKey.unseal(packagedSealedMessage));
// }

// inline emscripten::val symmetricUnsealJsonPackagedSealedMessage(
//   SymmetricKey& symmetricKey,
//   const std::string& packagedSealedMessageJson
// ) {
//   return toJsUint8Array(
//     symmetricKey.unseal(
//       PackagedSealedMessage::fromJson(packagedSealedMessageJson)
//       )
//     );
// }


EMSCRIPTEN_BINDINGS(SymmetricKey) {

  emscripten::class_<SymmetricKey>("SymmetricKey")
    AddDerivablesSerliazable(SymmetricKey)

    // export class SymmetricKey extends DerivedSecret {
    //   readonly keyBytes: Uint8Array;
    .property<emscripten::val>("keyBytes",
      [](const SymmetricKey &symmetricKey)->emscripten::val{
        return toJsUint8Array(symmetricKey.keyBytes);
    })

    //   seal(message: BindableToString, unsealingInstructions: string): PackagedSealedMessage;
    .function("seal", emscripten::select_overload<const PackagedSealedMessage(const std::string&, const std::string&)const>(&SymmetricKey::seal))

    //   unseal(packagedSealedMessage: PackagedSealedMessage): Uint8Array;
    .function("unseal", *[](const SymmetricKey& symmetricKey, const PackagedSealedMessage& packagedSealedMessage)->emscripten::val {
        return toJsUint8Array(symmetricKey.unseal(packagedSealedMessage));
      })
    //   unsealJsonPackagedSealedMessage(packagedSealedMessageJson: string): Uint8Array;
    .function(
        "unsealJsonPackagedSealedMessage", *[](const SymmetricKey& symmetricKey, const std::string& packagedSealedMessageJson)->emscripten::val {
        return toJsUint8Array(symmetricKey.unseal(
            PackagedSealedMessage::fromJson(packagedSealedMessageJson)
          ));
      })
    //   unsealBinaryPackagedSealedMessage(binaryPackagedSealedMessage: TypedByteArray): Uint8Array;
    .function(
        "unsealBinaryPackagedSealedMessage", *[](const SymmetricKey& symmetricKey, const std::string& binaryPackagedSealedMessage)->emscripten::val {
        return toJsUint8Array(symmetricKey.unseal(
            PackagedSealedMessage::fromSerializedBinaryForm(binaryPackagedSealedMessage))
          );
      })

    // }

    // class StaticSymmetricKey extends DerivedSecretStatics<SymmetricKey> {
    //   unseal(packagedSealedMessage: PackagedSealedMessage, seedString: string): Uint8Array;
    .class_function<emscripten::val>(
      "unseal",*[](
        const PackagedSealedMessage& packagedSealedMessage,
        const std::string& seedString
       ) { return toJsUint8Array(
          SymmetricKey::unseal(packagedSealedMessage, seedString)
        ); }
    )
    //   unsealJsonPackagedSealedMessage(jsonPackagedSealedMessage: string, seedString: string): Uint8Array;
    .class_function<emscripten::val>(
      "unsealJsonPackagedSealedMessage",*[](
        const std::string& jsonPackagedSealedMessage,
        const std::string& seedString
       ) { return toJsUint8Array(
          SymmetricKey::unseal(
            PackagedSealedMessage::fromJson(jsonPackagedSealedMessage), seedString
          ) ); }
    )
    //   unsealBinaryPackagedSealedMessage(binaryPackagedSealedMessage: TypedByteArray, seedString: string): Uint8Array;
    .class_function<emscripten::val>(
      "unsealBinaryPackagedSealedMessage",*[](
        const emscripten::val binaryPackagedSealedMessage,
        const std::string& seedString
       ) { 
         return toJsUint8Array(
          SymmetricKey::unseal(
            PackagedSealedMessage::fromSerializedBinaryForm(
              sodiumBufferFromJsTypedNumericArray(binaryPackagedSealedMessage)
            ), seedString
          ) ); }
    )
    // }
  ;
}

