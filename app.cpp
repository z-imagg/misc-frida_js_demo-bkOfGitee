#include <string>

bool cxxFunc06_outArgString(int num,  std::string * numDescOut_){
    if(num>=0){
        numDescOut_->assign("PositiveOrZeroNum");
    }else{
        numDescOut_->assign("NegtiveNum");
    }
    return true;
}


int main(int argc,char** argv){
    std::string numDesc;
    cxxFunc06_outArgString(31, &numDesc);
    cxxFunc06_outArgString(-120, &numDesc);
    return 0;
}