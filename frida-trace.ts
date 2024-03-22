
function deveFunc(){

    // Process.enumerateModules().forEach(m=>console.log(`module=${m.name}`))

    const Mod=Process.findModuleByName("libtorch.so.1");
    const funcAddrLs:NativePointer[]=DebugSymbol.findFunctionsMatching("*")
    console.log(`调试信心中函数个数=${funcAddrLs.length}`)
    //调试信心中函数个数=289146
    
    const moduleNameSet:Set<string>=new Set();
    for (let funcAddr of funcAddrLs) {
        const funcK:DebugSymbol=DebugSymbol.fromAddress(funcAddr);
        if (funcK.moduleName && !moduleNameSet.has(funcK.moduleName) ){
            console.log(`调试信息中的新模块，${funcK.moduleName}`)
            moduleNameSet.add(funcK.moduleName)
        }
        // console.log(funcK);
    }

    console.log(`调试信息中模块列表=${moduleNameSet}`)

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
    deveFunc()

  }, 0);

