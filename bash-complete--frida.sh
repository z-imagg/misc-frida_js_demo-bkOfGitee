#!/usr/bin/env bash

#source me.sh

_frida() {
    local pre cur opts

    COMPREPLY=()
    pre=${COMP_WORDS[COMP_CWORD-1]}
    cur=${COMP_WORDS[COMP_CWORD]}
    opts="--help --device --usb --remote --host --certificate --origin --token --keepalive-interval --p2p --stun-server --relay --file --attach-name --attach-identifier --attach-pid --await --stdio --aux --realm --runtime --debug --squelch-crash --options-file --version --load --parameters --cmodule --toolchain --codeshare --eval --timeout --pause --output --eternalize --exit-on-error --auto-perform --auto-reload --no-auto-reload"
    case "$cur" in
    -* )
        COMPREPLY=( $( compgen -W "$opts" -- $cur ) )
    esac
}
complete -F _frida   frida
