//from  https://gitee.com/x619920921/frida-js/raw/main/frida-trace.js

    
    let moduleMap = new ModuleMap();
    let base_size = moduleMap.find(addr).size;

            this.tid = Process.getCurrentThreadId();
            Stalker.follow(this.tid, {
                events: {
                    call: true
                },
                onReceive: function(events) {
                    let allEvents = Stalker.parse(events);
                    let first_depth = 0;
                    let is_first = true;
                    for (let i = 0; i < allEvents.length; i++) {
                        // 调用的流程, location是哪里发生的调用, target是调用到了哪里
                        if (allEvents[i][0] === "call") {
                            let location = allEvents[i][1]; // 调用地址
                            let target = allEvents[i][2];   // 目标地址
                            let depth = allEvents[i][3];    // depth
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