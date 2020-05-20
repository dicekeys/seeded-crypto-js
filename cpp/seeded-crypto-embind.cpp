#include <emscripten/bind.h>
#include <vector>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"

using namespace emscripten;

template<typename T>
std::vector<T> vectorFromJsTypedNumericArray(const val &typedArray)
{
  const unsigned int length = typedArray["length"].as<unsigned int>();
  const unsigned int bytesPerElement = typedArray["BYTES_PER_ELEMENT"].as<unsigned int>();
  const unsigned int lengthInBytes = bytesPerElement * length;
  const val heap = val::module_property("HEAPU8");
  const val memory = heap["buffer"];
  std::vector<T> vec(lengthInBytes / sizeof(T));
  const val memoryView = typedArray["constructor"].new_(memory, reinterpret_cast<uintptr_t>(vec.data()), length);
  memoryView.call<void>("set", typedArray);
  return vec;
}

val arrayToJavaScriptUint8Array(
  const unsigned char* dataPtr,
  const size_t length
) {
  val bufferAsTypedMemoryView(typed_memory_view(length, dataPtr));
  val uint8Array = val::global("Uint8Array").new_(length);
  uint8Array.call<void>("set", bufferAsTypedMemoryView);
  return uint8Array;
}  

#define AddSerializable(CLASSTYPE) \
  .class_function("fromSerializedBinaryForm", &CLASSTYPE::fromSerializedBinaryForm) \
  .function("toSerializedBinaryForm", &CLASSTYPE::toSerializedBinaryForm) \
  .class_function("fromJson", &CLASSTYPE::fromJson) \
  .function("toJson", &CLASSTYPE::toJson) \

#define AddDerivablesSerliazable(CLASSTYPE)     AddSerializable(CLASSTYPE) \
  .class_function("deriveFromSeed", &CLASSTYPE::deriveFromSeed)


inline val sodiumBufferToJavaScriptUint8Array(const SodiumBuffer &sodiumBuffer) {
  return arrayToJavaScriptUint8Array(sodiumBuffer.data, sodiumBuffer.length);
}

inline val byteVectorToJavaScriptUint8Array(const std::vector<unsigned char> byteVector) {
  return arrayToJavaScriptUint8Array(byteVector.data(), byteVector.size());
}

inline val symmetricUnseal(
  const SymmetricKey& symmetricKey, 
  const PackagedSealedMessage& packagedSealedMessage
) {
  return sodiumBufferToJavaScriptUint8Array(symmetricKey.unseal(packagedSealedMessage));
}

inline val symmetricUnsealJsonPackagedSealedMessage(
  SymmetricKey& symmetricKey,
  const std::string& packagedSealedMessageJson
) {
  return sodiumBufferToJavaScriptUint8Array(
    symmetricKey.unseal(
      PackagedSealedMessage::fromJson(packagedSealedMessageJson)
      )
    );
}

inline val symmetricKeyGetKeyBytes(const SymmetricKey &symmetricKey) {
  return sodiumBufferToJavaScriptUint8Array(symmetricKey.keyBytes);
}

inline val staticUnseal(
  const PackagedSealedMessage& packagedSealedMessage,
  const std::string& derivationOptions
) {
  return sodiumBufferToJavaScriptUint8Array(
    SymmetricKey::unseal(packagedSealedMessage, derivationOptions)
  );
}


inline PackagedSealedMessage* constructPackageSealedMessage(
  val ciphertext,
  const std::string& derivationOptionsJson,
  const std::string& unsealingInstructions
) { return new PackagedSealedMessage(
      vectorFromJsTypedNumericArray<unsigned char>(ciphertext), derivationOptionsJson, unsealingInstructions);
}

EMSCRIPTEN_BINDINGS(SeededCrypto) {
  
  class_<PackagedSealedMessage>("PackagedSealedMessage")
    AddSerializable(PackagedSealedMessage)
    .constructor(&constructPackageSealedMessage, allow_raw_pointers())    
  ;

  class_<SymmetricKey>("SymmetricKey")
   AddDerivablesSerliazable(SymmetricKey)
   .property("keyBytes", &symmetricKeyGetKeyBytes)
   .function("seal", select_overload<const PackagedSealedMessage(const std::string&, const std::string&)const>(&SymmetricKey::seal))
   .function("unseal", &symmetricUnseal)
   .function("unsealJsonPackagedSealedMessage", &symmetricUnsealJsonPackagedSealedMessage)
   .class_function("unseal", &staticUnseal)
    // .class_function("deriveFromSeed", &SymmetricKey::deriveFromSeed)
    // .class_function("fromSerializedBinaryForm", &SymmetricKey::fromSerializedBinaryForm)
    // .function("toSerializedBinaryForm", &SymmetricKey::toSerializedBinaryForm)
    // .class_function("fromJson", &SymmetricKey::fromJson)
    // .function("toJson", &SymmetricKey::toJson)
    ;
}

