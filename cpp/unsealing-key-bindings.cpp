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

    .function("toJsObject", *[](const UnsealingKey &unsealingKey)->emscripten::val{
      auto obj = emscripten::val::object();
      obj.set("unsealingKeyBytes", toJsUint8Array(unsealingKey.unsealingKeyBytes));
      obj.set("sealingKeyBytes", toJsUint8Array(unsealingKey.sealingKeyBytes));
      obj.set("recipe", unsealingKey.recipe);
      return obj;
    })
    .class_function<UnsealingKey>("fromJsObject", *[](const emscripten::val &jsObj)->UnsealingKey{
      const SodiumBuffer unsealingKeyBytes = sodiumBufferFromJsTypedNumericArray(jsObj["unsealingKeyBytes"]);
      const std::vector<unsigned char> sealingKeyBytes = byteVectorFromJsNumericArray(jsObj["sealingKeyBytes"]);
      const std::string recipe = jsObj["recipe"].as<std::string>();
      return UnsealingKey(unsealingKeyBytes, sealingKeyBytes, recipe);
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

    //   seal(message: BindableToString, seedString: string, derivationOptions: string): PackagedSealedMessage;
    .class_function<PackagedSealedMessage>(
      "seal",*[](const std::string& message, const std::string& seedString, const std::string& derivationOptions) {
          return UnsealingKey::deriveFromSeed(seedString, derivationOptions).getSealingKey().seal(message);
        }
    )

    //   seal(message: BindableToString, unsealingInstructions: string, seedString: string, derivationOptions: string): PackagedSealedMessage;
    .class_function<PackagedSealedMessage>(
      "sealWithInstructions",*[](const std::string& message, const std::string& unsealingInstructions, const std::string& seedString, const std::string& derivationOptions) {
          return UnsealingKey::deriveFromSeed(seedString, derivationOptions).getSealingKey().seal(message, unsealingInstructions);
        }
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

