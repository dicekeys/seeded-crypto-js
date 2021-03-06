cmake_minimum_required(VERSION 3.15)
set( CMAKE_CXX_STANDARD 11 )


set(SEEDED_CRYPTO_PROJECT_NAME seeded-crypto-js)
project(${SEEDED_CRYPTO_PROJECT_NAME}
    VERSION 0.10
    DESCRIPTION "Seeded Cryptography Library"
    LANGUAGES CXX
)

set(SEEDED_CRYPTO_BUILD_DOC OFF)
add_subdirectory("seeded-crypto")

# Gather all the source files
# Source Files
file(GLOB SRC_FILES
    "*.cpp"
    "*/*.cpp"
) 
file(GLOB HEADER_FILES
    "*.h"
    "*/*.h"
)
file(GLOB ALL_SRC_FILES
    "*.h"
    "*/*.h"
    "*.cpp"
    "*/*.cpp"
)

#source_group("Sources" FILES ${SRC_FILES})
#source_group("Headers" FILES ${HEADERS_FILES})

add_executable(${SEEDED_CRYPTO_PROJECT_NAME}
    ${ALL_SRC_FILES}
)

# Use C++ 11
set_target_properties(${SEEDED_CRYPTO_PROJECT_NAME}  PROPERTIES
	CXX_STANDARD 11
)

target_compile_options(
    ${SEEDED_CRYPTO_PROJECT_NAME} PRIVATE
    -std=c++1z
    -Wall
    -Werror
    "SHELL:-s MODULARIZE=1"
    "SHELL:-s ASSERTIONS=2"
    "SHELL:-s DISABLE_EXCEPTION_CATCHING=0"
    "SHELL:-s EXCEPTION_DEBUG=1"
#    --memory-init-file 0
    -O3
    -g4
)


# Copy built webassembly javascript code into /src
set_target_properties(
    ${SEEDED_CRYPTO_PROJECT_NAME}
    PROPERTIES
#    ARCHIVE_OUTPUT_DIRECTORY "${PROJECT_SOURCE_DIR}/../src/"
#    LIBRARY_OUTPUT_DIRECTORY "${PROJECT_SOURCE_DIR}/../src/"
    RUNTIME_OUTPUT_DIRECTORY "${PROJECT_SOURCE_DIR}/../src/"
)

target_link_options(
    ${SEEDED_CRYPTO_PROJECT_NAME} PUBLIC
    --bind
    "SHELL:-s DISABLE_EXCEPTION_CATCHING=0"
    "SHELL:-s MODULARIZE=1"
    "SHELL:-s ASSERTIONS=2"
############# HERE THERE BE DRAGONS ##################################
# Due to what Stuart believes is a bug in emscripten,
# if you set TOTAL_MEMORY running this code in Node 10
# will crash.
# Fortunately, it's fine to use the default and to ALLOW_MEMORY_GROWTH
##
#    "SHELL:-s TOTAL_MEMORY=32MB" # UNCOMMENT AT YOUR OWN RISK
#######################################################################
    "SHELL:-s ALLOW_MEMORY_GROWTH=1"
    "SHELL:-s SINGLE_FILE=1"
    -g4
# Turn on after tooling has better ES6 module support, and change output name to .mjs
#    "SHELL:-s EXPORT_ES6=1"
#   "SHELL:-s USE_ES6_IMPORT_META=0"
)


target_include_directories( ${SEEDED_CRYPTO_PROJECT_NAME} PUBLIC
    ${PROJECT_SOURCE_DIR}/seeded-crypto
    $ENV{emsdk}/upstream/emscripten/system/include/
    seeded-crypto/extern/libsodium/src/libsodium/include/
)

target_link_libraries(${SEEDED_CRYPTO_PROJECT_NAME}
    PRIVATE
    lib-seeded
)

