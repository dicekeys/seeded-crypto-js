# Seeded Cryptography Library for JavaScript and TypeScript



EMSDK is the emscripten SDK
```bash
setenv EMSDK <path_to_emsdk>
```

```bash
## Windows
cmake -G Ninja -DCMAKE_TOOLCHAIN_FILE="$env:emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake" -S cpp -B build
## Bash
cmake -G Ninja -DCMAKE_TOOLCHAIN_FILE="$emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake" -S cpp -B build
cd build; ninja; cd ..
```

Still need to manually compile OpenCV
Still need to copy read-dicekey-js.[js|wasm] from build/bin to src