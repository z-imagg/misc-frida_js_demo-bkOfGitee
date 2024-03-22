📦
1169 /frida-trace.js.map
2317 /frida-trace.js
✄
{"version":3,"file":"frida-trace.js","sourceRoot":"/fridaAnlzAp/frida_js/","sources":["frida-trace.ts"],"names":[],"mappings":"AACA,SAAS,QAAQ;IAEb,yEAAyE;IAEzE,uDAAuD;IACvD,eAAe;IACf,MAAM,YAAY,GAAiB,WAAW,CAAC,qBAAqB,CAAC,GAAG,CAAC,CAAA;IACzE,OAAO,CAAC,GAAG,CAAC,aAAa,YAAY,CAAC,MAAM,EAAE,CAAC,CAAA;IAE/C,MAAM;IACN,MAAM,OAAO,GAAa,IAAI,GAAG,EAAE,CAAC;IAEpC,cAAc;IACd,KAAK,IAAI,MAAM,IAAI,YAAY,EAAE;QAC7B,UAAU;QACV,MAAM,GAAG,GAAa,WAAW,CAAC,WAAW,CAAC,MAAM,CAAC,CAAC;QAEtD,MAAM,KAAK,GAAa,GAAG,CAAC,UAAU,CAAC;QACvC,MAAM,MAAM,GAAa,GAAG,CAAC,QAAQ,CAAC;QACtC,+BAA+B;QAC/B,IACI,CAAC,CAAC,MAAM,EAAE,UAAU,CAAC,kBAAkB,CAAC,CAAC;YACzC,CAAC,CAAC,MAAM,EAAE,UAAU,CAAC,mCAAmC,CAAC,CAAC,EAC7D;YACG,SAAS;YACT,OAAO,CAAC,GAAG,CAAC,IAAI,CAAC,SAAS,CAAC,GAAG,CAAC,CAAC,CAAC;SACpC;QAED,iBAAiB;QACjB,IAAI,KAAK,IAAI,CAAC,OAAO,CAAC,GAAG,CAAC,KAAK,CAAC,IAAI,CAAC,GAAG,CAAC,QAAQ,EAAE,UAAU,CAAC,kBAAkB,CAAC,EAAC;YAC9E,OAAO,CAAC,GAAG,CAAC,aAAa,KAAK,EAAE,CAAC,CAAA;YACjC,OAAO,CAAC,GAAG,CAAC,KAAK,CAAC,CAAA;SACrB;KACJ;IAED,OAAO,CAAC,GAAG,CAAC,aAAa,OAAO,EAAE,CAAC,CAAA;AAEvC,CAAC;AAED;;;;;;;;;;;;;;GAcG;AAGH;;;;;;GAMG;AACH,0EAA0E;AAC1E,UAAU,CAAC;IACP,MAAM;IACN,QAAQ,EAAE,CAAA;AAEZ,CAAC,EAAE,CAAC,CAAC,CAAC"}
✄
function deveFunc() {
    // Process.enumerateModules().forEach(m=>console.log(`module=${m.name}`))
    // const Mod=Process.findModuleByName("libtorch.so.1");
    //获取调试信息中全部函数地址
    const fnLsInDbgSym = DebugSymbol.findFunctionsMatching("*");
    console.log(`调试信心中函数个数=${fnLsInDbgSym.length}`);
    //模块名集
    const mdNmSet = new Set();
    //遍历调试信息中的全部函数
    for (let fnAdrK of fnLsInDbgSym) {
        //函数地址k的详情
        const fnK = DebugSymbol.fromAddress(fnAdrK);
        const modNm = fnK.moduleName;
        const fileNm = fnK.fileName;
        // 忽略/usr/include/c++/等下的相关源文件名
        if ((!fileNm?.startsWith("/usr/include/c++")) &&
            (!fileNm?.startsWith("/usr/include/x86_64-linux-gnu/c++"))) {
            //打印函数地址k
            console.log(JSON.stringify(fnK));
        }
        //函数k的模块名 加入 模块名集
        if (modNm && !mdNmSet.has(modNm) && !fnK.fileName?.startsWith("/usr/include/c++")) {
            console.log(`调试信息中的新模块，${modNm}`);
            mdNmSet.add(modNm);
        }
    }
    console.log(`调试信息中模块列表=${mdNmSet}`);
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