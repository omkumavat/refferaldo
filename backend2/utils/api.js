exports.ok=(res,data={},message='Success',status=200)=>res.status(status).json({success:true,message,data});
exports.fail=(res,message='Request failed',status=400,errors=[])=>res.status(status).json({success:false,message,errors});
exports.asyncHandler=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
exports.pick=(obj,keys)=>keys.reduce((o,k)=>{if(obj[k]!==undefined)o[k]=obj[k];return o},{});
