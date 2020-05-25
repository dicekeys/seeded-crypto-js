#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include "binding-helpers.hpp"
#include "binding-macros.hpp"

EMSCRIPTEN_BINDINGS(SymmetricKey) {

  emscripten::class_<SymmetricKey>("SymmetricKey")
    AddSerializable(SymmetricKey)
    AddDirectlyDerivable(SymmetricKey)
    // export class SymmetricKey extends DerivedSecret {
    //   readonly keyBytes: Uint8Array;
    .property<emscripten::val>("keyBytes",
      [](const SymmetricKey &symmetricKey)->emscripten::val{
        return toJsUint8Array(symmetricKey.keyBytes);
    })

    //   sealWithInstructions(message: BindableToString, unsealingInstructions: string): PackagedSealedMessage;
    .function("sealWithInstructions", emscripten::select_overload<const PackagedSealedMessage(const std::string&, const std::string&)const>(&SymmetricKey::seal))

    //   seal(message: BindableToString): PackagedSealedMessage;
    .function("seal", *[](
        const SymmetricKey& symmetricKey,
        const std::string& message
      )->PackagedSealedMessage {
        return symmetricKey.seal(message);
      })

    //   sealToCiphertextOnly(message: BindableToString, unsealingInstructions: string): Uint8Array;
    .function("sealToCiphertextOnlyWithInstructions", *[](
        const SymmetricKey& symmetricKey,
        const std::string& message,
        const std::string& unsealingInstructions
      ) {
        return toJsUint8Array(symmetricKey.sealToCiphertextOnly(message, unsealingInstructions));
      })


    //   sealToCiphertextOnly(message: BindableToString, unsealingInstructions: string): Uint8Array;
    .function("sealToCiphertextOnly", *[](
        const SymmetricKey& symmetricKey,
        const std::string& message
      ) {
        return toJsUint8Array(symmetricKey.sealToCiphertextOnly(message));
      })

    //   seal(message: BindableToString, unsealingInstructions: string): PackagedSealedMessage;
    .function("seal", emscripten::select_overload<const PackagedSealedMessage(const std::string&, const std::string&)const>(&SymmetricKey::seal))

    //   sealToCiphertextOnly(message: BindableToString, unsealingInstructions: string): Uint8Array;
    .function("sealToCiphertextOnly", *[](
        const SymmetricKey& symmetricKey,
        const std::string& message,
        const std::string& unsealingInstructions = {}
      )->emscripten::val {
        return toJsUint8Array( symmetricKey.sealToCiphertextOnly(message, unsealingInstructions) );
      })

    // unsealCiphertext(ciphertext: TypedByteArray, unsealingInstructions: string): Uint8Array;
    .function("unsealCiphertext", *[](const SymmetricKey& symmetricKey, const emscripten::val &ciphertext, const std::string& unsealingInstructions)->emscripten::val {
        return toJsUint8Array(symmetricKey.unseal(byteVectorFromJsNumericArray(ciphertext), unsealingInstructions));
      })

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
    //   seal(message: BindableToString, seedString: string, derivationOptions: string): PackagedSealedMessage;
    .class_function<PackagedSealedMessage>(
      "seal",*[](const std::string& message, const std::string& seedString, const std::string& derivationOptions) {
          return SymmetricKey::deriveFromSeed(seedString, derivationOptions).seal(message);
        }
    )

    //   seal(message: BindableToString, unsealingInstructions: string, seedString: string, derivationOptions: string): PackagedSealedMessage;
    .class_function<PackagedSealedMessage>(
      "sealWithInstructions",*[](const std::string& message, const std::string& unsealingInstructions, const std::string& seedString, const std::string& derivationOptions) {
          return SymmetricKey::deriveFromSeed(seedString, derivationOptions).seal(message, unsealingInstructions);
        }
    )

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
  ;
}

