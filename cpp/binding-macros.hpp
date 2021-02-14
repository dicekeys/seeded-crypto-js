#pragma once

#include <emscripten/bind.h>
#include "binding-helpers.hpp"



#define AddSerializable(CLASSTYPE) \
  .class_function("fromSerializedBinaryForm", *[] \
    (const emscripten::val serializedBinaryForm)->CLASSTYPE{ \
      return CLASSTYPE::fromSerializedBinaryForm( \
        sodiumBufferFromJsTypedNumericArray(serializedBinaryForm) \
      ); \
    }) \
  .function("toSerializedBinaryForm",  *[] \
    (const CLASSTYPE &binarySerializable)->emscripten::val{ \
      return toJsUint8Array(binarySerializable.toSerializedBinaryForm()); \
    }) \
  .class_function("fromJson", &CLASSTYPE::fromJson) \
  .function("toJson",  *[] \
    (const CLASSTYPE &jsonSerializable)->std::string{ return jsonSerializable.toJson(); }) \
  .function("toCustomJson", &CLASSTYPE::toJson)

#define AddIndirectlyDerivable(CLASSTYPE) \
  .property<std::string>("derivationOptionsJson", *[] \
  (const CLASSTYPE &derivable)->std::string{ return derivable.derivationOptionsJson; }) \
  .property<std::string>("recipeJson", *[] \
  (const CLASSTYPE &derivable)->std::string{ return derivable.derivationOptionsJson; })


#define AddDirectlyDerivable(CLASSTYPE)  \
  AddIndirectlyDerivable(CLASSTYPE) \
  .class_function("deriveFromSeed", &CLASSTYPE::deriveFromSeed)

