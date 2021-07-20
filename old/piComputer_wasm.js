
var wasmModule;
const runWasmDigitCalc = async () => {
   // Instantiate our wasm module
   wasmModule = await wasmBrowserInstantiate("./PiComputer.wasm");

 };
 runWasmDigitCalc();
