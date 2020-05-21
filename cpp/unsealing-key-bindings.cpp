#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"


EMSCRIPTEN_BINDINGS(UnsealingKey) {

  emscripten::class_<UnsealingKey>("UnsealingKey")
    AddDerivablesSerliazable(UnsealingKey)

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
  //   //   seal(message: BindableToString, unsealingInstructions: string): PackagedSealedMessage;
  //   .function("seal", emscripten::select_overload<const PackagedSealedMessage(const std::string&, const std::string&)const>(&UnsealingKey::seal))
  //
  //   //   unseal(packagedSealedMessage: PackagedSealedMessage): Uint8Array;
  //   .function("unseal", *[](const UnsealingKey& UnsealingKey, const PackagedSealedMessage& packagedSealedMessage)->emscripten::val {
  //       return toJsUint8Array(UnsealingKey.unseal(packagedSealedMessage));
  //     })
  //   //   unsealJsonPackagedSealedMessage(packagedSealedMessageJson: string): Uint8Array;
  //   .function(
  //       "unsealJsonPackagedSealedMessage", *[](const UnsealingKey& UnsealingKey, const std::string& packagedSealedMessageJson)->emscripten::val {
  //       return toJsUint8Array(UnsealingKey.unseal(
  //           PackagedSealedMessage::fromJson(packagedSealedMessageJson)
  //         ));
  //     })
  //   //   unsealBinaryPackagedSealedMessage(binaryPackagedSealedMessage: TypedByteArray): Uint8Array;
  //   .function(
  //       "unsealBinaryPackagedSealedMessage", *[](const UnsealingKey& UnsealingKey, const std::string& binaryPackagedSealedMessage)->emscripten::val {
  //       return toJsUint8Array(UnsealingKey.unseal(
  //           PackagedSealedMessage::fromSerializedBinaryForm(binaryPackagedSealedMessage))
  //         );
  //     })

  //   // }

  //   // class StaticUnsealingKey extends DerivedSecretStatics<UnsealingKey> {
  //   //   seal(message: BindableToString, unsealingInstructions: string, seedString: string, derivationOptions: string): PackagedSealedMessage;
  //   .class_function<PackagedSealedMessage>(
  //     "seal",*[](const std::string& message, const std::string& unsealingInstructions, const std::string& seedString, const std::string& derivationOptions) {
  //         return UnsealingKey::deriveFromSeed(seedString, derivationOptions).seal(message, unsealingInstructions);
  //       }
  //   )
  //   //   unseal(packagedSealedMessage: PackagedSealedMessage, seedString: string): Uint8Array;
  //   .class_function<emscripten::val>(
  //     "unseal",*[](
  //       const PackagedSealedMessage& packagedSealedMessage,
  //       const std::string& seedString
  //      ) { return toJsUint8Array(
  //         UnsealingKey::unseal(packagedSealedMessage, seedString)
  //       ); }
  //   )
  //   //   unsealJsonPackagedSealedMessage(jsonPackagedSealedMessage: string, seedString: string): Uint8Array;
  //   .class_function<emscripten::val>(
  //     "unsealJsonPackagedSealedMessage",*[](
  //       const std::string& jsonPackagedSealedMessage,
  //       const std::string& seedString
  //      ) { return toJsUint8Array(
  //         UnsealingKey::unseal(
  //           PackagedSealedMessage::fromJson(jsonPackagedSealedMessage), seedString
  //         ) ); }
  //   )
  //   //   unsealBinaryPackagedSealedMessage(binaryPackagedSealedMessage: TypedByteArray, seedString: string): Uint8Array;
  //   .class_function<emscripten::val>(
  //     "unsealBinaryPackagedSealedMessage",*[](
  //       const emscripten::val binaryPackagedSealedMessage,
  //       const std::string& seedString
  //      ) { 
  //        return toJsUint8Array(
  //         UnsealingKey::unseal(
  //           PackagedSealedMessage::fromSerializedBinaryForm(
  //             sodiumBufferFromJsTypedNumericArray(binaryPackagedSealedMessage)
  //           ), seedString
  //         ) ); }
  //   )
  //   // }
  ;
}

