

const asyncHandler = (fun)=>{
    return (req,res,next)=>{
        Promise.resolve(fun(req,res,next)).catch(next)
    }
}


export default asyncHandler


// const asyncHandler = (fun)=>{
//     return async (req,res,next) =>{
//         try{
//             await fun(req,res,next)
//         }catch(err){
//             next(err)
//         }
//     }
// }