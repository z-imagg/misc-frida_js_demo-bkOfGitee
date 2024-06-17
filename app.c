#include <stdio.h>
int func01_return_int(char ch, double real_num){
    int res=ch+real_num+10;
    if(res>3*ch){
        return res;
    }else{
        return -res;
    }
}
float func02_skip(){
    printf("call func02_skip\n");
    return 4.1;
}
int main(int argc,char** argv){

    func02_skip();
    if(argc>0 && argv!=NULL){
        for(int k=0; k <argc; k++){
            printf("argv[%d]=%s\n",k,argv[k]);
        }
    }

    
    return 0;
}