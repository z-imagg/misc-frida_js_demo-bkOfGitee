📦
381 /frida-trace.js.map
357 /frida-trace.js
✄
{"version":3,"file":"frida-trace.js","sourceRoot":"/fridaAnlzAp/frida_js/","sources":["frida-trace.ts"],"names":[],"mappings":"AACA,SAAS,QAAQ;IAEb,yEAAyE;IAEzE,IAAI,GAAG,GAAC,OAAO,CAAC,gBAAgB,CAAC,eAAe,CAAC,CAAC;IAClD,MAAM,iBAAiB,GAAiB,WAAW,CAAC,qBAAqB,CAAC,GAAG,CAAC,CAAA;IAC9E,OAAO,CAAC,GAAG,CAAC,aAAa,iBAAiB,CAAC,MAAM,EAAE,CAAC,CAAA;IACpD,kBAAkB;AAEtB,CAAC;AAKD,QAAQ,EAAE,CAAA"}
✄
function deveFunc() {
    // Process.enumerateModules().forEach(m=>console.log(`module=${m.name}`))
    var Mod = Process.findModuleByName("libtorch.so.1");
    const funcLsInDebugSymb = DebugSymbol.findFunctionsMatching("*");
    console.log(`调试信心中函数个数=${funcLsInDebugSymb.length}`);
    //调试信心中函数个数=289146
}
deveFunc();