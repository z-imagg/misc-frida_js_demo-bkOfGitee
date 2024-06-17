#include <stdio.h>
int main(int argc,char** argv){

    if(argc>0 && argv!=NULL){
        for(int k=0; k <argc; k++){
            printf("argv[%d]=%s\n",k,argv[k]);
        }
    }

    return 0;
}