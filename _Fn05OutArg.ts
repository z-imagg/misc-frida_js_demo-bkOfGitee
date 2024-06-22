// [依赖] : _logFile.ts/logWriteLn

enum Fn05ArgIdx{
    // func05_userQuery 函数签名
    // /fridaAnlzAp/frida_js_demo/app.c
    // float func05_userQuery(char sex, int userId, int userName_limit, char* userName_out_, int* userName_length_out_);
      sex=0,
      userId=1,
      userName_limit=2,
      userName_out_=3,
      userName_length_out_=4
    }
    class Fn05OutArg{
      
      int__userName_limit:number
      charArr__userName_out_:NativePointer
      intPtr_userName_length_out_:NativePointer
    
      static Enter(args:InvocationArguments,
        _int__userName_limit:number,
        _charArr__userName_out_:NativePointer,
        _intPtr_userName_length_out_:NativePointer){
          return new Fn05OutArg(args, _int__userName_limit, _charArr__userName_out_,_intPtr_userName_length_out_);
      }
    
    //进入函数func05_userQuery的处理
      constructor(args:InvocationArguments,
         _int__userName_limit:number,
         _charArr__userName_out_:NativePointer,
         _intPtr_userName_length_out_:NativePointer
         ){
    
    
    // const arg0_toInt32:number=args[0].toInt32() // ==  sex
    
    // const arg1_toInt32:number=args[1].toInt32() // == userId
    
    // args[2].toInt32() // == userName_limit
    args[Fn05ArgIdx.userName_limit]=new NativePointer(_int__userName_limit);// 修改 输入参数 userName_limit 为 _int__userName_limit
    logWriteLn(`[frida_js Fn05OutArg.constructor] userName_limit=[${_int__userName_limit}]`); 
    this.int__userName_limit=_int__userName_limit
    
    // const arg3_readCString:string| null=args[3].readCString() // == userName_out_
    args[Fn05ArgIdx.userName_out_]=_charArr__userName_out_ // 修改 入参 userName_out_ 为 _charArr__userName_out_
    logWriteLn(`[frida_js Fn05OutArg.constructor] userName_out_=[${_charArr__userName_out_}]`); 
    this.charArr__userName_out_=_charArr__userName_out_ //保留 之
    
    // const arg4_readInt:number=args[4].readInt() // == userName_length_out_
    args[Fn05ArgIdx.userName_length_out_]=_intPtr_userName_length_out_ // 修改 入参 userName_length_out_ 为 _intPtr_userName_length_out_
    logWriteLn(`[frida_js Fn05OutArg.constructor] userName_length_out_=[${_intPtr_userName_length_out_}]`); 
    this.intPtr_userName_length_out_=_intPtr_userName_length_out_ //保留 之
    }
    
    //离开函数func05_userQuery的处理
      Leave(){
      //现在是函数离开时, 由于函数进入时 参数们args[k]被保存在thiz下, 因此此时可以拿出来
      // const userName_limit:NativePointer=this.int__userName_limit
      const userName_out_:NativePointer=this.charArr__userName_out_
      const userName_length_out_:NativePointer=this.intPtr_userName_length_out_
      logWriteLn(`[frida_js Fn05OutArg.Leave] json(this)=[${JSON.stringify(this)}]`);
    
      // func05_userQuery 函数签名
      // /fridaAnlzAp/frida_js_demo/app.c
      // float func05_userQuery(char sex, int userId, int userName_limit, char* userName_out_, int* userName_length_out_);
      
      const arg2_toInt32:number=this.int__userName_limit // == userName_limit
      logWriteLn(`[frida_js  Fn05OutArg.Leave] arg2_toInt32=[${arg2_toInt32}]`); 
    
      //函数离开时, 获取到 函数出参 userName_out_
      const arg3_readCString:string| null=this.charArr__userName_out_.readCString() // == userName_out_
      if(arg3_readCString){
        logWriteLn(`[frida_js  Fn05OutArg.Leave] arg3_readCString=[${arg3_readCString}]`);
      }
      
      //函数离开时, 获取到 函数出参 userName_length_out_
      const arg4_readInt:number=this.intPtr_userName_length_out_.readInt() // == userName_length_out_
      logWriteLn(`[frida_js  Fn05OutArg.Leave] arg4_readInt=[${arg4_readInt}]`);
      userName_length_out_.writeInt(-88); // 修改 输入参数 userName_length_out_ 为 -88; 这句是为了实验，并无业务目的
      }
    
    }