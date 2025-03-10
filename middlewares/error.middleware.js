const errorMiddleware=(err,req,res,next)=>{
try{
    let error={ ...err};
    error.message=err.message;
    console.error(err);

    if(error.name=='CastError'){
        const message='Resource not found';
        error=new Error(message);
        error.statusCode=404;
    }

    if(error.name===11000){
        const message='Duplicate field value entered';
        error=new Error(message);
        error.statusCode=400;
    }

    if(error.name=='ValidationError'){
        const message= Object.values(err.errors).map(val=>val.messsage);
        error=new Error(message.join(','));
        error.statusCode=400;
    }

    res.status(error.statusCode || 500).json({success:false,error:error.message||'Server Error'});
}
catch(error){
next(error);
}
}

export default errorMiddleware;