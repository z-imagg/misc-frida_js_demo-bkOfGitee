📦
666 /frida-trace.js.map
671 /frida-trace.js
✄
{"version":3,"file":"frida-trace.js","sourceRoot":"/fridaAnlzAp/frida_js/","sources":["frida-trace.ts"],"names":[],"mappings":"AACA,SAAS,QAAQ;IAEb,yEAAyE;IAEzE,MAAM,GAAG,GAAC,OAAO,CAAC,gBAAgB,CAAC,eAAe,CAAC,CAAC;IACpD,MAAM,UAAU,GAAiB,WAAW,CAAC,qBAAqB,CAAC,GAAG,CAAC,CAAA;IACvE,OAAO,CAAC,GAAG,CAAC,aAAa,UAAU,CAAC,MAAM,EAAE,CAAC,CAAA;IAC7C,kBAAkB;IAElB,MAAM,aAAa,GAAa,IAAI,GAAG,EAAE,CAAC;IAC1C,KAAK,IAAI,QAAQ,IAAI,UAAU,EAAE;QAC7B,MAAM,KAAK,GAAa,WAAW,CAAC,WAAW,CAAC,QAAQ,CAAC,CAAC;QAC1D,IAAI,KAAK,CAAC,UAAU,EAAC;YACjB,aAAa,CAAC,GAAG,CAAC,KAAK,CAAC,UAAU,CAAC,CAAA;SACtC;QACD,sBAAsB;KACzB;IAED,OAAO,CAAC,GAAG,CAAC,aAAa,aAAa,EAAE,CAAC,CAAA;AAE7C,CAAC;AAKD,QAAQ,EAAE,CAAA"}
✄
function deveFunc() {
    // Process.enumerateModules().forEach(m=>console.log(`module=${m.name}`))
    const Mod = Process.findModuleByName("libtorch.so.1");
    const funcAddrLs = DebugSymbol.findFunctionsMatching("*");
    console.log(`调试信心中函数个数=${funcAddrLs.length}`);
    //调试信心中函数个数=289146
    const moduleNameSet = new Set();
    for (let funcAddr of funcAddrLs) {
        const funcK = DebugSymbol.fromAddress(funcAddr);
        if (funcK.moduleName) {
            moduleNameSet.add(funcK.moduleName);
        }
        // console.log(funcK);
    }
    console.log(`调试信息中模块列表=${moduleNameSet}`);
}
deveFunc();