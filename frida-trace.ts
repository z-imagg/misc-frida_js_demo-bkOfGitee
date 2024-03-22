
function deveFunc(){

    // Process.enumerateModules().forEach(m=>console.log(`module=${m.name}`))

    var Mod=Process.findModuleByName("libtorch.so.1");
    const funcLsInDebugSymb:NativePointer[]=DebugSymbol.findFunctionsMatching("*")
    console.log(`调试信心中函数个数=${funcLsInDebugSymb.length}`)
    //调试信心中函数个数=289146

}




deveFunc()