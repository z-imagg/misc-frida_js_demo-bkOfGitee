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
};

struct T_User func03_return_structUser(int _userId, char sex){
    if(_userId<30 && sex=='M'){
        struct T_User girl;
        girl.userId=_userId;
        girl.salary=4000.3;
        return girl;
    }
    
    if(_userId>30 && sex=='F'){
        struct T_User father;
        father.userId=_userId;
        father.salary=7000.9;
        return father;
    }

    struct T_User somebody;
    somebody.userId=0;
    somebody.salary=-1;
    return somebody;
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

    
    return 0;
}