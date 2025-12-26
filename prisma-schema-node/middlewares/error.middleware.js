const globalErrorHandler=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.status=err.status||"err";
    console.log("err: ",err);

    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
    });
};
export default globalErrorHandler;