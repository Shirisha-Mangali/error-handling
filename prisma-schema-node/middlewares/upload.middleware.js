//middlewares/upload.middleware.js
import multer from "multer";
import path from "path";

//storage configuration 
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/doctors");
    },
    filename:(req,file,cb)=>{
        const uniqueName=Date.now()+"-"+Math.round(Math.random()*1e9);
        cb(null,uniqueName+path.extname(file.originalname));
    },
});
//file validation
const fileFilter=(req,file,cb)=>{
    const allowedTypes=["image/jpeg","image/png","image/webp"];
    if(!allowedTypes.includes(file.mimetype)){
        cb(new Error("only JPG and PNG allowed"),false);
    }else{
        cb(null,true);
    }
}
//multer instance 
export const uploadDoctorImage=multer({
    storage,
    fileFilter,
    limits:{
        fileSize:2*1024*1024,//2mb
    },
});