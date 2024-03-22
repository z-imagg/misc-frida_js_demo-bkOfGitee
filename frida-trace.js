📦
1078 /frida-trace.js.map
2432 /frida-trace.js
✄
{"version":3,"file":"frida-trace.js","sourceRoot":"/fridaAnlzAp/frida_js/","sources":["frida-trace.ts"],"names":[],"mappings":"AACA,SAAS,QAAQ;IAEb,yEAAyE;IAEzE,uDAAuD;IACvD,eAAe;IACf,MAAM,YAAY,GAAiB,WAAW,CAAC,qBAAqB,CAAC,GAAG,CAAC,CAAA;IACzE,OAAO,CAAC,GAAG,CAAC,aAAa,YAAY,CAAC,MAAM,EAAE,CAAC,CAAA;IAE/C,MAAM,QAAQ,GAAkC,IAAI,GAAG,EAAE,CAAC;IAC1D,cAAc;IACd,KAAK,IAAI,MAAM,IAAI,YAAY,EAAE;QAC7B,UAAU;QACV,MAAM,MAAM,GAAa,WAAW,CAAC,WAAW,CAAC,MAAM,CAAC,CAAC;QAEzD,MAAM,KAAK,GAAa,MAAM,CAAC,UAAU,CAAC;QAC1C,MAAM,MAAM,GAAa,MAAM,CAAC,QAAQ,CAAC;QACzC,GAAG;QACH;QACI,0BAA0B;QAC1B,MAAM,IAAI,IAAI,IAAI,MAAM,IAAI,SAAS,IAAI,MAAM,IAAI,EAAE;YACrD,+BAA+B;YAC/B,MAAM,EAAE,UAAU,CAAC,kBAAkB,CAAC;YACtC,MAAM,EAAE,UAAU,CAAC,mCAAmC,CAAC,EAC1D;YACG,SAAS;SACZ;QAED,SAAS;QACT,uCAAuC;QAEvC,oCAAoC;QACpC,QAAQ,CAAC,GAAG,CAAC,MAAM,EAAE,MAAM,CAAC,CAAC;QAE7B,IAAG,QAAQ,CAAC,IAAI,GAAG,IAAI,IAAI,CAAC,EAAE;YAC1B,OAAO,CAAC,GAAG,CAAC,UAAU,QAAQ,CAAC,IAAI,EAAE,CAAC,CAAA;SACzC;KAEJ;AAGL,CAAC;AAED;;;;;;;;;;;;;;GAcG;AAGH;;;;;;GAMG;AACH,0EAA0E;AAC1E,UAAU,CAAC;IACP,MAAM;IACN,QAAQ,EAAE,CAAA;AAEZ,CAAC,EAAE,CAAC,CAAC,CAAC"}
✄
function deveFunc() {
    // Process.enumerateModules().forEach(m=>console.log(`module=${m.name}`))
    // const Mod=Process.findModuleByName("libtorch.so.1");
    //获取调试信息中全部函数地址
    const fnLsInDbgSym = DebugSymbol.findFunctionsMatching("*");
    console.log(`调试信心中函数个数=${fnLsInDbgSym.length}`);
    const fnSymTab = new Map();
    //遍历调试信息中的全部函数
    for (let fnAdrK of fnLsInDbgSym) {
        //函数地址k的详情
        const fnSymK = DebugSymbol.fromAddress(fnAdrK);
        const modNm = fnSymK.moduleName;
        const fileNm = fnSymK.fileName;
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
        // console.log(JSON.stringify(fnSymK));
        //该函数地址插入表格: 建立 函数地址 到 函数调试符号详情 的 表格
        fnSymTab.set(fnAdrK, fnSymK);
        if (fnSymTab.size % 1000 == 0) {
            console.log(`函数表格尺寸:${fnSymTab.size}`);
        }
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