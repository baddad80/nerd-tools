em++ --no-entry PiComputer.cpp \
-s WASM=1 \
-s IGNORE_MISSING_MAIN=1 \
-s EXPORTED_FUNCTIONS="['_computeDigitValue']" \
-s ERROR_ON_UNDEFINED_SYMBOLS=0 \
-O3 \
-o PiComputer.wasm

#-s LLD_REPORT_UNDEFINED \