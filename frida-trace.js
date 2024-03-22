📦
2315 /frida-trace.js.map
3000 /frida-trace.js
✄
{"version":3,"file":"frida-trace.js","sourceRoot":"/fridaAnlzAp/frida_js/","sources":["frida-trace.ts"],"names":[],"mappings":"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"}
✄
//from  https://gitee.com/x619920921/frida-js/raw/main/frida-trace.js
function followFunc() {
    Process.enumerateModules().forEach(m => console.log(`module=${m.name}`));
    const moduleName = "frida-agent-64.so";
    // Stalker.follow  【simple_nn.elf,  libtorch.so.1 , libc10.so , libcaffe2.so 】未获得任何call event
    // Stalker.follow 【 frida-agent-64.so 】有获得任何call event
    const _mod = Process.findModuleByName(moduleName);
    if (!_mod) {
        return;
    }
    const modu = _mod;
    // const base_addr:NativePointer=Module.getBaseAddress("");
    const base_addr = modu.base;
    const base_size = modu.size;
    const threadId = Process.getCurrentThreadId();
    Stalker.follow(threadId, {
        events: {
            call: true,
            //frida文档  https://frida.re/docs/javascript-api/#stalker
            block: true,
            compile: true
        },
        onReceive: function (events) {
            const eventLs = Stalker.parse(events);
            // console.log(`eventLs.constructor.name=${eventLs.constructor.name}`)
            // for (let i = 0; i < eventLs.length; i++) {
            //     const evt: StalkerEventFull | StalkerEventBare=eventLs[i];
            //     console.log(`evt.constructor.name=${evt.constructor.name}, evt.length=${evt.length}`)
            // }
            ////
            let first_depth = 0;
            let is_first = true;
            for (let i = 0; i < eventLs.length; i++) {
                const evt = eventLs[i];
                // 调用的流程, location是哪里发生的调用, target是调用到了哪里
                if (evt.length == 4 && evt[0] === "call") {
                    const scEvt = evt;
                    let location = scEvt[1]; // 调用地址
                    let target = scEvt[2]; // 目标地址
                    let depth = scEvt[3]; // depth
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
    });
}
function unfollowFunc() {
    const threadId = Process.getCurrentThreadId();
    Stalker.unfollow(threadId);
}
followFunc();