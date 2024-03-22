📦
908 /frida-trace.js.map
2133 /frida-trace.js
✄
{"version":3,"file":"frida-trace.js","sourceRoot":"/fridaAnlzAp/frida_js/","sources":["frida-trace.ts"],"names":[],"mappings":"AACA,SAAS,QAAQ;IAEb,yEAAyE;IAEzE,uDAAuD;IACvD,eAAe;IACf,MAAM,YAAY,GAAiB,WAAW,CAAC,qBAAqB,CAAC,GAAG,CAAC,CAAA;IACzE,OAAO,CAAC,GAAG,CAAC,aAAa,YAAY,CAAC,MAAM,EAAE,CAAC,CAAA;IAG/C,cAAc;IACd,KAAK,IAAI,MAAM,IAAI,YAAY,EAAE;QAC7B,UAAU;QACV,MAAM,GAAG,GAAa,WAAW,CAAC,WAAW,CAAC,MAAM,CAAC,CAAC;QAEtD,MAAM,KAAK,GAAa,GAAG,CAAC,UAAU,CAAC;QACvC,MAAM,MAAM,GAAa,GAAG,CAAC,QAAQ,CAAC;QACtC,GAAG;QACH;QACI,0BAA0B;QAC1B,MAAM,IAAI,IAAI,IAAI,MAAM,IAAI,SAAS,IAAI,MAAM,IAAI,EAAE;YACrD,+BAA+B;YAC/B,MAAM,EAAE,UAAU,CAAC,kBAAkB,CAAC;YACtC,MAAM,EAAE,UAAU,CAAC,mCAAmC,CAAC,EAC1D;YACG,SAAS;SACZ;QAED,SAAS;QACT,OAAO,CAAC,GAAG,CAAC,IAAI,CAAC,SAAS,CAAC,GAAG,CAAC,CAAC,CAAC;KAEpC;AAGL,CAAC;AAED;;;;;;;;;;;;;;GAcG;AAGH;;;;;;GAMG;AACH,0EAA0E;AAC1E,UAAU,CAAC;IACP,MAAM;IACN,QAAQ,EAAE,CAAA;AAEZ,CAAC,EAAE,CAAC,CAAC,CAAC"}
✄
function deveFunc() {
    // Process.enumerateModules().forEach(m=>console.log(`module=${m.name}`))
    // const Mod=Process.findModuleByName("libtorch.so.1");
    //获取调试信息中全部函数地址
    const fnLsInDbgSym = DebugSymbol.findFunctionsMatching("*");
    console.log(`调试信心中函数个数=${fnLsInDbgSym.length}`);
    //遍历调试信息中的全部函数
    for (let fnAdrK of fnLsInDbgSym) {
        //函数地址k的详情
        const fnK = DebugSymbol.fromAddress(fnAdrK);
        const modNm = fnK.moduleName;
        const fileNm = fnK.fileName;
        // 
        if (
        // 忽略 空文件名, 空文件名的是其他用途的符号？
        fileNm == null || fileNm == undefined || fileNm == "" ||
            // 忽略/usr/include/c++/等下的相关源文件名
            fileNm?.startsWith("/usr/include/c++") ||
            fileNm?.startsWith("/usr/include/x86_64-linux-gnu/c++")) {
            continue;
        }
        //打印函数地址k
        console.log(JSON.stringify(fnK));
    }
}
/**
调试信心中函数个数=289146
调试信息中的新模块，simple_nn.elf
调试信息中的新模块，linux-vdso.so.1
调试信息中的新模块，frida-agent-64.so
调试信息中的新模块，libopen-rte.so.40.30.2
调试信息中的新模块，libc.so.6
调试信息中的新模块，libudev.so.1.7.2
调试信息中的新模块，libmpi.so.40.30.2
调试信息中的新模块，libstdc++.so.6.0.30
调试信息中的新模块，libz.so.1.2.11
调试信息中的新模块，libopen-pal.so.40.30.2
调试信息中的新模块，libm.so.6
调试信息中的新模块，libcaffe2.so  #此模块中函数太多，很耗时，等不起
 */
/**
frida 运行报超时错误 "Failed to load script: timeout was reached" 解决

错误的解决办法： 命令行加选项timeout  'frida --timeout 0或-1或很大的数 --file ... '

正确的解决办法是，像下面这样  用 函数setTimeout(... , 0) 包裹 业务代码
 */
// frida  https://github.com/frida/frida/issues/113#issuecomment-187134331
setTimeout(function () {
    //业务代码
    deveFunc();
}, 0);