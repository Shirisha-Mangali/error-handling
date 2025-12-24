import { Router } from "express";
import prisma from "../prismaClient.js";

const router = Router();

//Return doctors along with the number of patients they have,
//but exclude doctors who have zero patients.
// router.get('/',async(req,res)=>{
//     const docs=await prisma.doctor.findMany({
//         where:{
//             patients:{some:{}}
//         },
//         include:{
//             //patients:false,
//             _count:{select:{patients:true}}
//             }
//     })
//     res.json(docs);
// })


/*Fetch patients who have taken at least one lab test
and return:

patient name

number of lab tests

latest test date*/

// router.get('/',async(req,res)=>{
// try{
//     const patients=await prisma.labTest.groupBy({
//         by:['patientId'],
//         _count:{patientId:true}  
//     })
//     console.log(patients)
//     //res.send(patients);
//     const pIds=patients.map(p=>p.patientId);
//     const pat=await prisma.patient.findMany({
//         where:{id:{in:pIds}},
//         select:{
//             id:true,
//             name:true
//         }
//     })
//     console.log(pat);
//     const result=pat.map(p=>{
//         const g=patients.find(x=>x.patientId===p.id);
//         return{
//             patientName:p.name,
//             countOfLabTests:g._count.patientId
//         }
//     })
//     res.json(result);
//     }
// catch(err){res.json({error:"sjdbcsjd errrrr"})}
// })

//average patient count of all doctors.
router.get('/', async (req, res) => {
  const grouped = await prisma.patient.groupBy({
    by: ['doctorId'],
    _count: {
      doctorId: true
    }
  })

  const totalDoctors = grouped.length
  const totalPatients = grouped.reduce(
    (sum, g) => sum + g._count.doctorId,
    0
  )

  res.json({
    totalDoctors,
    totalPatients,
    averagePatientsPerDoctor:
      totalDoctors === 0 ? 0 : totalPatients / totalDoctors
  })
})







export default router;