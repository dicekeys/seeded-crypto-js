#pragma once

#include <emscripten/bind.h>

template<typename T>
inline std::string toJsonSimple(T jsonSerializable) {
  return jsonSerializable.toJson();
}

#define AddSerializable(CLASSTYPE) \
  .class_function("fromSerializedBinaryForm", &CLASSTYPE::fromSerializedBinaryForm) \
  .function("toSerializedBinaryForm", &CLASSTYPE::toSerializedBinaryForm) \
  .class_function("fromJson", &CLASSTYPE::fromJson) \
  .function("toCustomJson", &CLASSTYPE::toJson) \
  .function("toJson", &toJsonSimple<CLASSTYPE>)

#define AddDerivablesSerliazable(CLASSTYPE)     AddSerializable(CLASSTYPE) \
  .class_function("deriveFromSeed", &CLASSTYPE::deriveFromSeed)
