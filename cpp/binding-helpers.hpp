#pragma once

#include <emscripten/bind.h>
#include "./seeded-crypto/lib-seeded/lib-seeded.hpp"
#include <vector>

template<typename T>
inline std::vector<T> vectorFromJsTypedNumericArray(const emscripten::val &typedArrayInJsHeap)
{
  const unsigned int length = typedArrayInJsHeap["length"].as<unsigned int>();
  const unsigned int bytesPerElement = typedArrayInJsHeap["BYTES_PER_ELEMENT"].as<unsigned int>();
  const unsigned int lengthInBytes = bytesPerElement * length;
  std::vector<T> vec;
  vec.resize(length);
  const emscripten::val typeArrayInCppHeap{emscripten::typed_memory_view(lengthInBytes, vec.data())};
  typeArrayInCppHeap.call<void>("set", typedArrayInJsHeap);
  return vec;
}

inline SodiumBuffer sodiumBufferFromJsTypedNumericArray(const emscripten::val &typedArray)
{
  const unsigned int length = typedArray["length"].as<unsigned int>();
  const unsigned int bytesPerElement = typedArray["BYTES_PER_ELEMENT"].as<unsigned int>();
  const unsigned int lengthInBytes = bytesPerElement * length;
  const emscripten::val heap = emscripten::val::module_property("HEAPU8");
  const emscripten::val memory = heap["buffer"];
  SodiumBuffer sodiumBuffer(lengthInBytes);
  const emscripten::val memoryView = typedArray["constructor"].new_(memory, reinterpret_cast<uintptr_t>(sodiumBuffer.data), length);
  memoryView.call<void>("set", typedArray);
  return sodiumBuffer;
}

inline std::vector<unsigned char> byteVectorFromJsNumericArray(const emscripten::val &typedArray) {
    return vectorFromJsTypedNumericArray<unsigned char>(typedArray);
}

inline emscripten::val arrayToJavaScriptUint8Array(
  const unsigned char* dataPtr,
  const size_t length
) {
  emscripten::val bufferAsTypedMemoryView(emscripten::typed_memory_view(length, dataPtr));
  emscripten::val uint8Array = emscripten::val::global("Uint8Array").new_(length);
  uint8Array.call<void>("set", bufferAsTypedMemoryView);
  return uint8Array;
}

inline emscripten::val toJsUint8Array(const SodiumBuffer &sodiumBuffer) {
  return arrayToJavaScriptUint8Array(sodiumBuffer.data, sodiumBuffer.length);
}

inline emscripten::val toJsUint8Array(const std::vector<unsigned char> byteVector) {
  return arrayToJavaScriptUint8Array(byteVector.data(), byteVector.size());
}
