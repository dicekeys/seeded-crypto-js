#pragma once

#include <emscripten/bind.h>
#include "binding-helpers.hpp"

template<typename T>
inline std::string toJsonSimple(T jsonSerializable) {
  return jsonSerializable.toJson();
}

template<typename T>
inline emscripten::val toSerializedBinaryForm(T binarySerializable) {
  return toJsUint8Array(binarySerializable.toSerializedBinaryForm());
}

#define AddSerializable(CLASSTYPE) \
  .class_function("fromSerializedBinaryForm", &CLASSTYPE::fromSerializedBinaryForm) \
  .function("toSerializedBinaryForm", &toSerializedBinaryForm<CLASSTYPE>) \
  .class_function("fromJson", &CLASSTYPE::fromJson) \
  .function("toJson",  *[] \
    (const CLASSTYPE &jsonSerializable)->std::string{ return jsonSerializable.toJson(); }) \
  .function("toCustomJson", &CLASSTYPE::toJson)

#define AddIndirectlyDerivable(CLASSTYPE) \
  .property<std::string>("derivationOptionsJson", *[] \
  (const CLASSTYPE &derivable)->std::string{ return derivable.derivationOptionsJson; })


#define AddDirectlyDerivable(CLASSTYPE)  \
  AddIndirectlyDerivable(CLASSTYPE) \
  .class_function("deriveFromSeed", &CLASSTYPE::deriveFromSeed)

