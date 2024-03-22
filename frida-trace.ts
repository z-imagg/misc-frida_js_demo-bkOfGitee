//from  https://gitee.com/x619920921/frida-js/raw/main/frida-trace.js

function followFunc(){
    const _mod:Module | null=Process.findModuleByName("simple_nn.elf");
    if (!_mod ){
        return ;
    }
    const modu:Module =_mod;
    // const base_addr:NativePointer=Module.getBaseAddress("");
    const base_addr:NativePointer = modu.base;
    const base_size:number = modu.size;

    const threadId:ThreadId = Process.getCurrentThreadId();
Stalker.follow(threadId, {
    events: {
        call: true,
//frida文档  https://frida.re/docs/javascript-api/#stalker
        block: true, 
        compile: true  
    },
    onReceive: function(events:ArrayBuffer) {
        const eventLs: StalkerEventFull[] | StalkerEventBare[] = Stalker.parse(events);
        // console.log(`eventLs.constructor.name=${eventLs.constructor.name}`)
        // for (let i = 0; i < eventLs.length; i++) {
        //     const evt: StalkerEventFull | StalkerEventBare=eventLs[i];
        //     console.log(`evt.constructor.name=${evt.constructor.name}, evt.length=${evt.length}`)
        // }

        ////
        let first_depth = 0;
        let is_first = true;
        for (let i = 0; i < eventLs.length; i++) {
            const evt=eventLs[i]; 
            // 调用的流程, location是哪里发生的调用, target是调用到了哪里
            if (evt.length == 4 && evt[0] === "call") {
                const scEvt:StalkerCallEventFull=(evt as StalkerCallEventFull)
                let location: NativePointer  = (scEvt[1] as NativePointer); // 调用地址
                let target: NativePointer = (scEvt[2] as NativePointer);   // 目标地址
                let depth = scEvt[3];    // depth
                let description = '';
                let space_num = '';
                if (target.compare(base_addr) >= 0 && target.compare(base_addr.add(base_size)) < 0) {
                    if (is_first) {
                        is_first = false;
                        first_depth = depth;
                    }
                    let location_description = ' [' + location.sub(base_addr) + '] ';
                    let target_description = ' [' + location.sub(base_addr) + ']';
                    let length = (depth - first_depth);
                    for (let j = 0; j < length; j++) {
                        space_num = space_num + ' ';
                    }
                    description = space_num + target_description + '(' + location_description + ')' + ' -- ' + length;
                    console.log(description); 
                } 
            }
        }

        ////
    }
})
            

}


function unfollowFunc(){
    const threadId:ThreadId = Process.getCurrentThreadId();
    Stalker.unfollow(threadId);
}


followFunc()