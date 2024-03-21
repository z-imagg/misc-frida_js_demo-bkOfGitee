//from  https://gitee.com/x619920921/frida-js/raw/main/frida-trace.js

import assert from "assert";

    //{ TODO 请用正确的值
    const base_addr:NativePointer =  new NativePointer(0);
    const addr:NativePointer=new NativePointer(0);
    //}

    const moduleMap:ModuleMap = new ModuleMap();
    const _module:Module|null=moduleMap.find(addr);
    assert(_module !=null)
    const base_size:number = _module.size;

            const threadId:ThreadId = Process.getCurrentThreadId();
            Stalker.follow(threadId, {
                events: {
                    call: true
                },
                onReceive: function(events:ArrayBuffer) {
                    const allEvents:StalkerEventFull[] = (Stalker.parse(events) as StalkerEventFull[]);
                    let first_depth = 0;
                    let is_first = true;
                    for (let i = 0; i < allEvents.length; i++) {
                        const evt=allEvents[i]; 
                        // 调用的流程, location是哪里发生的调用, target是调用到了哪里
                        if (evt[0] === "call") {
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
                                let location_description = ' [' + ptr(location).sub(base_addr) + '] ';
                                let target_description = ' [' + ptr(target).sub(base_addr) + ']';
                                let length = (depth - first_depth);
                                for (let j = 0; j < length; j++) {
                                    space_num = space_num + ' ';
                                }
                                description = space_num + target_description + '(' + location_description + ')' + ' -- ' + length;
                                console.log(description); 
                            } 
                        }
                    }
                }
            })
            
            Stalker.unfollow(this.tid);