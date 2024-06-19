


## frida命令只允许目标应用携带非中划线参数


frida只允许应用携带非中划线参数 , 

若目标应用需要携带中划线参数 则 必须在 x.ts 中 该应用解析应用参数前 修改应用参数

### frida命令 举例 


- `frida --load x.ts --file app.elf app_arg1 app_arg2` 合法的 目标应用及其参数

- `frida --load x.ts --file app.elf -app_option1 app_value1` 不合法的 目标应用及其参数
   因为 `-app_option1` 会被当成是 `frida命令` 的参数, 而不是`应用app.elf`的参数
