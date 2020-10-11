#include <stdexcept>
#include <string>
#include <emscripten/bind.h>

std::string getExceptionMessage(size_t pointer)
{
  auto error = reinterpret_cast<std::runtime_error *>(pointer);
  return std::string(error->what());
}

EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("getExceptionMessage", &getExceptionMessage);
}