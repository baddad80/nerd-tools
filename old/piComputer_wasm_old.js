
var wasmModule;
function runWasmDigitCalc () {
   // Instantiate our wasm module
   wasmModule = wasmBrowserInstantiate("./PiComputer.wasm");

 };
 runWasmDigitCalc();
