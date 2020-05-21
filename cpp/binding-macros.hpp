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
  .function("toCustomJson", &CLASSTYPE::toJson) \
  .function("toJson", &toJsonSimple<CLASSTYPE>)

#define AddDerivablesSerliazable(CLASSTYPE)    AddSerializable(CLASSTYPE) \
  .class_function("deriveFromSeed", &CLASSTYPE::deriveFromSeed) \
  .property<std::string>("derivationOptionsJson", \
      [](const CLASSTYPE &derivable)->std::string{ return derivable.derivationOptionsJson; })

