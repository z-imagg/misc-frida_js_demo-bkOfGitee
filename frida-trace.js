📦
515 /frida-trace.js.map
475 /frida-trace.js
✄
{"version":3,"file":"frida-trace.js","sourceRoot":"/fridaAnlzAp/frida_js/","sources":["frida-trace.ts"],"names":[],"mappings":"AACA,SAAS,QAAQ;IAEb,yEAAyE;IAEzE,MAAM,GAAG,GAAC,OAAO,CAAC,gBAAgB,CAAC,eAAe,CAAC,CAAC;IACpD,MAAM,UAAU,GAAiB,WAAW,CAAC,qBAAqB,CAAC,GAAG,CAAC,CAAA;IACvE,OAAO,CAAC,GAAG,CAAC,aAAa,UAAU,CAAC,MAAM,EAAE,CAAC,CAAA;IAC7C,kBAAkB;IAElB,KAAK,IAAI,QAAQ,IAAI,UAAU,EAAE;QAC7B,MAAM,KAAK,GAAa,WAAW,CAAC,WAAW,CAAC,QAAQ,CAAC,CAAC;QAC1D,OAAO,CAAC,GAAG,CAAC,KAAK,CAAC,CAAC;KACtB;AAGL,CAAC;AAKD,QAAQ,EAAE,CAAA"}
✄
function deveFunc() {
    // Process.enumerateModules().forEach(m=>console.log(`module=${m.name}`))
    const Mod = Process.findModuleByName("libtorch.so.1");
    const funcAddrLs = DebugSymbol.findFunctionsMatching("*");
    console.log(`调试信心中函数个数=${funcAddrLs.length}`);
    //调试信心中函数个数=289146
    for (let funcAddr of funcAddrLs) {
        const funcK = DebugSymbol.fromAddress(funcAddr);
        console.log(funcK);
    }
}
deveFunc();