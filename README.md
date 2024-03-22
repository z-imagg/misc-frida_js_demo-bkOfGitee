来源： https://github.com/oleavr/frida-agent-example.git

安装依赖，```npm install```

将ts编译为js, ```npx frida-compile frida-trace.ts --output frida-trace.js``` 也可以用调用写在package.json中的build代词 ```npm run build```


frida的ts编译为js专用编译器为frida-compile, ```npx frida-compile --help```
```txt
Usage: frida-compile [options] <module>

Options:
  -o, --output <file>   write output to <file>
  -w, --watch           watch for changes and recompile
  -S, --no-source-maps  omit source-maps
  -c, --compress        compress using terser
  -h, --help            display help for command

```