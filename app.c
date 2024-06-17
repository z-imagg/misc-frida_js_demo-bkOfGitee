#include <stdio.h>
int func01_return_int(char ch, double real_num){
    int res=ch+real_num+10;
    if(res>3*ch){
        return res;
    }else{
        return -res;
    }
}

struct T_User{
short userId;
float salary;
int sum;
};

//指针参数携带返回结构体
void func03_retVoid_outArgPtrStructUser(int _userId, char sex, struct T_User* outArg_ptrStructUsr){
    if(_userId<30 && sex=='M'){
        outArg_ptrStructUsr->userId=_userId+200;
        outArg_ptrStructUsr->salary=3000.1f;
        outArg_ptrStructUsr->sum=-123;
        return  ;
    }
    
    if(_userId>30 && sex=='F'){
        outArg_ptrStructUsr->userId=_userId+1000;
        outArg_ptrStructUsr->salary=7000.9;
        outArg_ptrStructUsr->sum=-654;
        return  ;
    }

    outArg_ptrStructUsr->userId=0;
    outArg_ptrStructUsr->salary=-1;
    return ;
}


//指针参数携带返回结构体
#define _Concat_Limit 50
#define _Concat_CntTop 4
#define _Buffer_Limit  (_Concat_CntTop * _Concat_Limit)
#define _Err__CharBuffer_NULL 1
#define _Err__concat_outOf_Limit 2
#define _Err__k_outOf_Limit 3
#define _Err__buffer_outOf_Limit 4
#define _OK 0
int func04_retVoid_outArgCharBuffer(double _doubleNum, long _longInt, char* outArg_CharBuffer){
    if(outArg_CharBuffer==NULL){
        return _Err__CharBuffer_NULL;
    }

    char concatBuf[_Concat_Limit+1];
    concatBuf[0]='\0';

    //初始化缓存为空串
    outArg_CharBuffer[0]='\0';

    int concat_ret_n=0;
    int longConcat_ret_n=0;
    int k=0;
    int longLen_k=0;
    char* buffer_begin_k=NULL;

    //拼接第1个字符串到缓存, 若超长则返回错误
    concat_ret_n=snprintf(concatBuf,_Concat_Limit,"name:%s,id:%d,pi:%f;","Zhangsan", 920, 3.1415926);
    k++;
    printf("k=%d,concat_ret_n=%d; concatBuf=[%s]\n",k,concat_ret_n,concatBuf);
    if(concat_ret_n>_Concat_Limit){
        return _Err__concat_outOf_Limit;
    }
    if(k>=_Concat_CntTop){
        return _Err__k_outOf_Limit;
    }
    buffer_begin_k=outArg_CharBuffer+longConcat_ret_n;
    longLen_k=k*_Concat_Limit;
    longConcat_ret_n=snprintf(buffer_begin_k,longLen_k,"%s%s",buffer_begin_k, concatBuf);
    if(longConcat_ret_n>longLen_k){
        return _Err__buffer_outOf_Limit;
    }
    printf("k=%d,longConcat_ret_n=%d; outArg_CharBuffer=[%s]\n",k,longConcat_ret_n,outArg_CharBuffer);
    

    int hex=99;
    //拼接第2个字符串到缓存, 若超长则返回错误
    concat_ret_n=snprintf(concatBuf,_Concat_Limit,"zzzzzzzzzzzzz,hex:%x,job_cnt:%d,msg:%s,", hex, 5, "hello_world");
    k++;
    printf("k=%d,concat_ret_n=%d; concatBuf=[%s]\n",k,concat_ret_n,concatBuf);
    if(concat_ret_n>_Concat_Limit){
        return _Err__concat_outOf_Limit;
    }
    if(k>=_Concat_CntTop){
        return _Err__k_outOf_Limit;
    }
    buffer_begin_k=outArg_CharBuffer+longConcat_ret_n;
    longLen_k=k*_Concat_Limit;
    longConcat_ret_n=snprintf(buffer_begin_k,longLen_k,"%s%s",buffer_begin_k, concatBuf);
    if(longConcat_ret_n>longLen_k){
        return _Err__buffer_outOf_Limit;
    }
    printf("k=%d,longConcat_ret_n=%d; outArg_CharBuffer=[%s]\n",k,longConcat_ret_n,outArg_CharBuffer);

    return _OK;
}

float func02_skip(){
    printf("call func02_skip\n");
    return 4.1;
}
int main(int argc,char** argv){
    printf("sizeof(char)=%d\n", sizeof(char));
    printf("sizeof(short)=%d\n", sizeof(short));
    printf("sizeof(int)=%d\n", sizeof(int));
    printf("sizeof(long)=%d\n", sizeof(long));
    printf("sizeof(float)=%d\n", sizeof(float));
    printf("sizeof(double)=%d\n", sizeof(double));
    printf("sizeof(int*)=%d\n", sizeof(int*));
    printf("sizeof(main)=%d\n", sizeof(main));
    printf("sizeof(struct T_User)=%d\n", sizeof(struct T_User));
/**
sizeof(char)=1
sizeof(short)=2
sizeof(int)=4
sizeof(long)=8
sizeof(float)=4
sizeof(double)=8
sizeof(int*)=8
sizeof(main)=1
sizeof(struct T_User)=8
*/

    func02_skip();
    if(argc>0 && argv!=NULL){
        for(int k=0; k <argc; k++){
            printf("argv[%d]=%s\n",k,argv[k]);
        }
    }


    char CharBuffer[512];
    int func04_ret_code=func04_retVoid_outArgCharBuffer(4.0, 17, CharBuffer);
    printf("func04_ret_code=%d,CharBuffer=[%s]\n",func04_ret_code,CharBuffer);
    
    return 0;
}