
function deveFunc(){

    // Process.enumerateModules().forEach(m=>console.log(`module=${m.name}`))

    const Mod=Process.findModuleByName("libtorch.so.1");
    const funcAddrLs:NativePointer[]=DebugSymbol.findFunctionsMatching("*")
    console.log(`调试信心中函数个数=${funcAddrLs.length}`)
    //调试信心中函数个数=289146

    for (let funcAddr of funcAddrLs) {
        const funcK:DebugSymbol=DebugSymbol.fromAddress(funcAddr);
        console.log(funcK);
    }


}




deveFunc()