#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"


EMSCRIPTEN_BINDINGS(UnsealingKey) {

  emscripten::class_<UnsealingKey>("UnsealingKey")
    AddSerializable(UnsealingKey)
    AddDirectlyDerivable(UnsealingKey)

    // export class UnsealingKey extends DerivedSecret {
    //   readonly sealingKeyBytes: Uint8Array;
    .property<emscripten::val>("sealingKeyBytes",
      [](const UnsealingKey &UnsealingKey)->emscripten::val{
        return toJsUint8Array(UnsealingKey.sealingKeyBytes);
    })

    //   readonly unsealingKeyBytes: Uint8Array;
    .property<emscripten::val>("unsealingKeyBytes",
      [](const UnsealingKey &UnsealingKey)->emscripten::val{
        return toJsUint8Array(UnsealingKey.unsealingKeyBytes);
    })

    // static  unseal(packagedSealedMessage: PackagedSealedMessage, seedString: string): Uint8Array;
    .class_function<emscripten::val>(
      "unseal",*[](
        const PackagedSealedMessage& packagedSealedMessage,
        const std::string& seedString
       ) { return toJsUint8Array(
          UnsealingKey::unseal(packagedSealedMessage, seedString)
        ); }
    )
        //   unsealJsonPackagedSealedMessage(jsonPackagedSealedMessage: string, seedString: string): Uint8Array;
    .class_function<emscripten::val>(
      "unsealJsonPackagedSealedMessage",*[](
        const std::string& jsonPackagedSealedMessage,
        const std::string& seedString
       ) { return toJsUint8Array(
          UnsealingKey::unseal(
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
          UnsealingKey::unseal(
            PackagedSealedMessage::fromSerializedBinaryForm(
              sodiumBufferFromJsTypedNumericArray(binaryPackagedSealedMessage)
            ), seedString
          ) ); }
    )

    // getSealingKey(): SealingKey;
    .function("getSealingKey", &UnsealingKey::getSealingKey)

    // unsealCiphertext(ciphertext: TypedByteArray, unsealingInstructions: string): Uint8Array;
    .function("unsealCiphertext", *[](const UnsealingKey& UnsealingKey, const emscripten::val &ciphertext, const std::string& unsealingInstructions)->emscripten::val {
        return toJsUint8Array(UnsealingKey.unseal(byteVectorFromJsNumericArray(ciphertext), unsealingInstructions));
      })

    // unseal(packagedSealedMessage: PackagedSealedMessage): Uint8Array;
    .function("unseal", *[](const UnsealingKey& UnsealingKey, const PackagedSealedMessage& packagedSealedMessage)->emscripten::val {
        return toJsUint8Array(UnsealingKey.unseal(packagedSealedMessage));
      })

    //   unsealJsonPackagedSealedMessage(packagedSealedMessageJson: string): Uint8Array;
    .function(
        "unsealJsonPackagedSealedMessage", *[](const UnsealingKey& unsealingKey, const std::string& packagedSealedMessageJson)->emscripten::val {
        return toJsUint8Array(unsealingKey.unseal(
            PackagedSealedMessage::fromJson(packagedSealedMessageJson)
          ));
      })
    //   unsealBinaryPackagedSealedMessage(binaryPackagedSealedMessage: TypedByteArray): Uint8Array;
    .function(
        "unsealBinaryPackagedSealedMessage", *[](const UnsealingKey& unsealingKey, const std::string& binaryPackagedSealedMessage)->emscripten::val {
        return toJsUint8Array(unsealingKey.unseal(
            PackagedSealedMessage::fromSerializedBinaryForm(binaryPackagedSealedMessage))
          );
      })
  ;
}
