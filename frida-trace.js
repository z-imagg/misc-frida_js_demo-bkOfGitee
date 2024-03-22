📦
848 /frida-trace.js.map
789 /frida-trace.js
✄
{"version":3,"file":"frida-trace.js","sourceRoot":"/fridaAnlzAp/frida_js/","sources":["frida-trace.ts"],"names":[],"mappings":"AAAA,qEAAqE;AAErE,SAAS,UAAU;IAEf,MAAM,QAAQ,GAAY,OAAO,CAAC,kBAAkB,EAAE,CAAC;IAC3D,OAAO,CAAC,MAAM,CAAC,QAAQ,EAAE;QACrB,MAAM,EAAE;YACJ,IAAI,EAAE,IAAI;SACb;QACD,SAAS,EAAE,UAAS,MAAkB;YAClC,MAAM,OAAO,GAA4C,OAAO,CAAC,KAAK,CAAC,MAAM,CAAC,CAAC;YAC/E,MAAM,eAAe,GAAQ,OAAM,CAAC,OAAO,CAAC,CAAA;YAC5C,OAAO,CAAC,GAAG,CAAC,mBAAmB,eAAe,EAAE,CAAC,CAAA;YACjD,KAAK,IAAI,CAAC,GAAG,CAAC,EAAE,CAAC,GAAG,OAAO,CAAC,MAAM,EAAE,CAAC,EAAE,EAAE;gBACrC,MAAM,GAAG,GAAsC,OAAO,CAAC,CAAC,CAAC,CAAC;gBAC1D,MAAM,aAAa,GAAQ,OAAM,CAAC,GAAG,CAAC,CAAA;gBACtC,OAAO,CAAC,GAAG,CAAC,iBAAiB,aAAa,EAAE,CAAC,CAAA;aAChD;QACL,CAAC;KACJ,CAAC,CAAA;AAGF,CAAC;AAGD,SAAS,YAAY;IACjB,MAAM,QAAQ,GAAY,OAAO,CAAC,kBAAkB,EAAE,CAAC;IACvD,OAAO,CAAC,QAAQ,CAAC,QAAQ,CAAC,CAAC;AAC/B,CAAC"}
✄
//from  https://gitee.com/x619920921/frida-js/raw/main/frida-trace.js
function followFunc() {
    const threadId = Process.getCurrentThreadId();
    Stalker.follow(threadId, {
        events: {
            call: true
        },
        onReceive: function (events) {
            const eventLs = Stalker.parse(events);
            const eventLsTypeName = typeof (eventLs);
            console.log(`eventLsTypeName=${eventLsTypeName}`);
            for (let i = 0; i < eventLs.length; i++) {
                const evt = eventLs[i];
                const eventTypeName = typeof (evt);
                console.log(`eventTypeName=${eventTypeName}`);
            }
        }
    });
}
function unfollowFunc() {
    const threadId = Process.getCurrentThreadId();
    Stalker.unfollow(threadId);
}