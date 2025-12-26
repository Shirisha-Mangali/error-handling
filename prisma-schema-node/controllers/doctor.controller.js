//doctor.controller.js
import prisma from "../prismaClient.js";
import AppError  from "../AppError.js";
// export const createDoctor = async (req, res) => {
//   try {
//     const existingDoctor = await prisma.doctor.findUnique({
//   where: { userId: req.body.userId },
// });

// if (existingDoctor) {
//   return res.status(409).json({
//     error: "Doctor already exists",
//   });
// }
//     const doctor = await prisma.doctor.create({
//       data: req.body,
//     });
//     res.status(201).json(doctor);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };




export const createDoctor=async(req,res,next)=>{
  try{
  const existingDoctor=await prisma.doctor.findUnique({
    where:{userId:req.body.userId}
  })
  if(existingDoctor){
    return next(new AppError("doctor already exists ",409));
  }
  const doctor=await prisma.doctor.create({
    data:req.body
  })
  res.status(201).json({
    status:"success",
    data:doctor,
  })
}catch(err){
  next(err);
}
}


/**
 * DOCTOR: Get own profile
 */
// export const getDoctorProfile = async (req, res) => {
//   const doctor = await prisma.doctor.findUnique({
//     where: { userId: req.user.id }
//   });

//   res.json(doctor);
// };



export const getDoctorProfile=async(req,res,next)=>{
  try{
  const doctor=await prisma.doctor.findUnique({
    where : {userId:req.user.id},
  })
  if(!doctor)next( new AppError("Doctor Profile not found",404));
  res.status(200).json({
    status:"succeesss",
    data:doctor
  })
}catch(err){
  next(err);
}
}




/**
 * DOCTOR: Get own patients
 */
// export const getDoctorPatients = async (req, res) => {
//   const doctor = await prisma.doctor.findUnique({
//     where: { userId: req.user.id },
//     include: { patients: true }
//   });

//   res.json(doctor.patients);
// };



export const getDoctorPatients = async (req, res, next) => {
  const doctor = await prisma.doctor.findUnique({
    where: { userId: req.user.id },
    include: { patients: true },
  });

  if (!doctor) {
    throw new AppError("Doctor not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: doctor.patients,
  });
};


export const uploadProfileImage=async(req,res)=>{
  //check if line exists 
  if(!req.file){
    return res.status(400).json({
      message:"No file uploaded",
    })
  }
  //build file path
  const imagePath=`uploads/doctors/${req.file.filename}`;
  //save path in DB
  await prisma.doctor.update({
    where:{userId:req.user.id},
    data:{profile_image:imagePath},
  });
  res.status(200).json({
    message:"profile img uplload successfully",
    imagePath,
  })
};