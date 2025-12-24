import { Router } from "express";
import prisma from "../prismaClient.js";

const router = Router();

//Fetch medicines with stock > 100
// router.get('/',async(req,res)=>{
//     const {minstock}=req.query;
//     const data=await prisma.medicine.findMany({
//         where:{stock:{gt:minstock?Number(minstock):undefined}}
//     })
//     res.json(data);

// })


//doctors whose name contains 1
// router.get('/',async(req,res)=>{
//     const{search}=req.query;
//     const data=await prisma.doctor.findMany({
//         where:{
//             name:{
//             contains:search,
//             mode:'insensitive'
//             }
//         }
//     })
//     res.json(data);
// })


//doctors wose name starts with p
// router.get('/',async(req,res)=>{
//     const {search}=req.query
//     const data=await prisma.doctor.findMany({
//         where:{
//             name:{
//                 startsWith:search
//             }
//         }
//     })
//     res.json(data);
// })


//medicines  whose stock is gt 50, price lt 100
// router.get('/',async(req,res)=>{
//     const {minstock,maxprice}=req.query;
//     const data=await prisma.medicine.findMany({
//         where:{
//             AND:[
//                 {stock:{gt:Number(minstock)}},
//                 {price:{lt:Number(maxprice)}}
        
//             ]
//         }
//     })
//     res.json(data);
// })



//pagination
// router.get('/',async(req,res)=>{
//     const pg=Number(req.query.page)||1;
//     const limit=Number(req.query.limit)||10;
//     const patients=await prisma.patient.findMany({
//         skip:(pg-1)*limit,
//         take:limit,
//     });
//     res.json(patients);
// })


// router.get('/',async(req,res)=>{
//     const pg=Number(req.query.page)||1
//     const limit=Number(req.query.limit)||5
//     const patients=await prisma.patient.findMany({
//         select:{
//             id:true,
//             name:true,
//             doctor:{
//                 select:{
//                     name:true
//                 }
//             }
//         },
//         orderBy:{id:'asc'},
//         skip:0,
//         take:10,
//     })
//     res.json(patients);
// })



//doctors with number of appointments

// router.get('/',async(req,res)=>{
//     const doctors=await prisma.doctor.findMany({
//         select:{
//             id:true,
//             name:true,
//             _count:{
//                 select:{
//                     appointments:true
//                 }
//             }
//         }
//     })
//     const ans=doctors.map(d=>{
//         return{
//             doctorId:d.id,
//             doctorName:d.name,
//             appointmentsCount:d._count.appointments
//         }
//     })
//     res.send(ans);
// })


//Top 5 appointments per department
// router.get('/',async(req,res)=>{
//     const grouped=await prisma.appointment.groupBy({
//         by:['doctorId'],
//         _count:{id:true}
//     })
//     console.log(grouped);
//     const doctors=await prisma.doctor.findMany({
//         select:{
//             id:true,
//             departmentId:true
//         }
//     })
//     const deptMap={};
//     grouped.forEach(g=>{
//         const doc=doctors.find(d=>d.id===g.doctorId);
//         if(!doc)return;
//         if(!deptMap[doc.departmentId])deptMap[doc.departmentId]=0;
//         deptMap[doc.departmentId]+=g._count.id;
//     })
//     const top5=Object.entries(deptMap)
//     .map(([deptId,count])=>({deptId:Number(deptId),appointment:count}))
//     .sort((a,b)=>b.appointmentCount)
//     .slice(0,5)
//     res.send(top5);
// })


//Find appointments between 2025-01-01 and 2025-03-01
// router.get('/',async(req,res)=>{
//     try{
//         const appointments=await prisma.appointment.findMany({
//             where:{
//                 date:{
//                     gte:new Date('2025-01-01'),
//                     lte:new Date('2025-03-01')
//                 }
//             },
//             include:{
//                 doctor:{
//                     select :{id:true,name:true},
//                 },
//                 patient:{
//                     select:{id:true,name:true}
//                 }
//             }
//         })
//         res.json(appointments)
//     }
//     catch(err){res.json({error:"dnjbd errrr"})}
// })




//Find departments with at least 10 doctors
router.get('/',async(req,res)=>{
    const grp=await prisma.doctor.groupBy({
        by:['departmentId'],
        _count:{
            id:true
        },
        having: {
            id: {
            _count: { gte: 10 }
            }
        }

    })
    console.log(grp);
    const deptIds=grp.map(g=>g.departmentId);
    const departs=await prisma.dept.findMany({
        where:{id:{in:deptIds}}
    })
    const ans=departs.map(d=>{
        const g=grp.find(x=>x.departmentId=d.id)
        return {
            deptId:d.id,
            deptName:d.deptName,
            count:g._count?.id
        }
    })
    res.json(ans);
})



//Group appointments by doctorId and return:
export default router;