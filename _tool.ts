//MyTsBegin//


//{4字节对齐 工具函数
function is4times(n:number){
const is_:boolean =Math.floor( n / 4 )*4 == n ;
return is_;
}

function near4times(n:number){
  const near:number =Math.floor( (n+(4-1)) / 4 )*4   ;
  return near;
}
//}

