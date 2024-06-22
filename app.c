#include <stdio.h>
#include <string.h>

int func01_return_int(char ch, double real_num){
    int res=ch+real_num+10;
    if(res>3*ch){
        return res;
    }else{
        return -res;
    }
}

char* g_name_zhangsan="zhangsan1995";
int g_name_zhangsan_len=12+1;
char* g_name_LiSi="LiSi2040";
int g_name_LiSi_len=8+1;
char* g_name_Tom="TomCheryW";
int g_name_Tom_len=9+1;
char* g_name_RmZ="RoomZix080";
int g_name_RmZ_len=10+1;
char* g_name_NoFit="_NoCondFit_";
int g_name_NoFit_len=11+1;

float func05_userQuery(
// args:InvocationArguments
char sex, // sex == args[0].toInt32()
int userId, // userId == args[1].toInt32()
int userName_limit, // userName_limit == args[2].toInt32()
char* userName_out_, // userName_out_ == args[3].readCString()
int* userName_length_out_ // userName_length_out_ == args[4].readInt()
){
    float result=-0.2;
    printf("[app.c, func05_userQuery args] sex=[%c][%d], userId=%d, userName_limit=%d, userName_out_=%x, userName_length_out_=%x \n", sex,sex, userId,userName_limit, userName_out_, userName_length_out_);
    if(sex=='M'){
        if(userId>50){
            strncpy(userName_out_,g_name_zhangsan,g_name_zhangsan_len);
            (*userName_length_out_)=g_name_zhangsan_len;
            result= 1.4;
        }else{
            strncpy(userName_out_,g_name_LiSi,g_name_LiSi_len);
            (*userName_length_out_)=g_name_LiSi_len;
            result= 2.9;
        }
    }else
    if(sex=='F'){
        if(userId%2==0){
            strncpy(userName_out_,g_name_Tom,g_name_Tom);
            (*userName_length_out_)=g_name_Tom;
            result= 10.9;
        }else{
            strncpy(userName_out_,g_name_RmZ,g_name_RmZ_len);
            (*userName_length_out_)=g_name_RmZ_len;
            result= 47.1;
        }
    }else{
    strncpy(userName_out_,g_name_NoFit,g_name_NoFit_len);
    (*userName_length_out_)=g_name_NoFit_len;
    }


    printf("[app.c, end_func05_userQuery_out] userName_out_=%s,userName_length_out_=%d,userName_limit=%d \n",userName_out_,*userName_length_out_,userName_limit);

    return result;
}

float func02_skip(){
    printf("call func02_skip\n");
    return 4.1;
}
int main(int argc,char** argv){
    // printf("sizeof(char)=%d\n", sizeof(char));
    // printf("sizeof(short)=%d\n", sizeof(short));
    // printf("sizeof(int)=%d\n", sizeof(int));
    // printf("sizeof(long)=%d\n", sizeof(long));
    // printf("sizeof(float)=%d\n", sizeof(float));
    // printf("sizeof(double)=%d\n", sizeof(double));
    // printf("sizeof(int*)=%d\n", sizeof(int*));
    // printf("sizeof(main)=%d\n", sizeof(main));
    // printf("sizeof(struct T_User)=%d\n", sizeof(struct T_User));
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
            // printf("argv[%d]=%s\n",k,argv[k]);
        }
    }


    
    // #define _UserName1_Limit 64
    // char userName1[_UserName1_Limit];
    int userId1=1000;
    // int userName1_Len;
    func05_userQuery('M', userId1, 0, NULL, NULL );
    // printf("[app.c, func05_userQuery out] userName1=%s,userName1_Len=%d\n",userName1,userName1_Len);

    // #define _UserName2_Limit 128
    // char userName2[_UserName2_Limit];
    int userId2=-901;
    // int userName2_Len;
    func05_userQuery('F', userId2, 0, NULL, NULL );
    // printf("[app.c, func05_userQuery out] userName2=%s,userName2_Len=%d\n",userName2,userName2_Len);

    return 0;
}