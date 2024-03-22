//from  https://gitee.com/x619920921/frida-js/raw/main/frida-trace.js

function followFunc(){

    const threadId:ThreadId = Process.getCurrentThreadId();
Stalker.follow(threadId, {
    events: {
        call: true
    },
    onReceive: function(events:ArrayBuffer) {
        const eventLs: StalkerEventFull[] | StalkerEventBare[] = Stalker.parse(events);
        for (let i = 0; i < eventLs.length; i++) {
            const evt: StalkerEventFull | StalkerEventBare=eventLs[i]; 
        }
    }
})
            

}


function unfollowFunc(){
    const threadId:ThreadId = Process.getCurrentThreadId();
    Stalker.unfollow(threadId);
}