


## frida命令只允许目标应用携带非中划线参数


frida只允许应用携带非中划线参数 , 

若目标应用需要携带中划线参数 则 必须在 x.ts 中 该应用解析应用参数前 修改应用参数

### frida命令 举例 


- `frida --load x.ts --file app.elf app_arg1 app_arg2` 合法的 目标应用及其参数

- `frida --load x.ts --file app.elf -app_option1 app_value1` 不合法的 目标应用及其参数
   因为 `-app_option1` 会被当成是 `frida命令` 的参数, 而不是`应用app.elf`的参数


## frida 的js脚本调试过程（修复问题过程）（开发完后调试直到正确运行的过程）

### 一、 执行交互命令 :

`frida --pause  --load InterceptFnSym_generated.js.txt --file /fridaAnlzAp/frida_js_demo/app.elf arg1 2 arg3`

需要 `--pause`参数

### 二、 重复 'vscode修改js、观看效果' 直到 问题已修复

1. vscode修改 该 x.js.txt  ， 在 关键点 增加console.log打印语句， 保存 , 去 步骤2

2. 则 上面frida交互命令会重新执行`应用app.elf + x.js.txt` 从而看到打印输出， 去 步骤3、步骤4

3. 打印输出 可以 指引 出 问题 在哪， 从而 做出 修改, 去 步骤1

4. 打印输出 可以 表示 问题是否修复好了。  若 修好了， 则结束。 若 没修好， 则 去 步骤1