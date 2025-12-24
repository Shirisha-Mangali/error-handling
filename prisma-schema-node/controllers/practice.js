import { Router } from "express";
import prisma from "../prismaClient.js";

const router = Router();

// router.get('/',async(req,res)=>{
//     const data=await prisma.doctor.findMany();
//     res.json(data);
// })

//doctprs & their patients
// router.get('/',async(req,res)=>{
//     const data=await prisma.doctor.findMany({
//         include:{patients:true}
//     })
//     res.json(data);
// })


//doctprs & their patients count
// router.get('/',async(req,res)=>{
//     const data=await prisma.doctor.findMany({
//         include:{
//             //patients:true,
//             _count:{
//                 select:{patients:true}
//             }
//         }
//     })
//     res.json(data);
// })


//doctors with atleast one patient
// router.get('/',async(req,res)=>{
//     const data=await prisma.doctor.findMany({
//         where:{
//             patients:{some:{}}
//         }

//     })
//     res.json(data);
// })

//doctors with more than 5 patients
// router.get('/',async(req,res)=>{
// const data=await prisma.doctor.findMany({
//     include:{
//         patients:false,
//         _count:{
//             select:{patients:true}
//         }
//     }
// })
// const r=data.filter(d=>d._count.patients>3)
// res.json(r)
// })

//doctors who as more than 5 patients 
// router.get('/',async(req,res)=>{
//     try{
//         const grouped=await prisma.patient.groupBy({
//             by:['doctorId'],
//             _count:{
//                doctorId:true 
//             },
//             having:{
//                 doctorId:{
//                     _count:{gt:4}
//                 }
//             }
//         })
//         const result=grouped.map(g=>({
//             doctorId:g.doctorId,
//             count:g._count.doctorId
//         }))
//         res.json(result);
//     }catch(err){
//         res.status(500).json({error:"err while retrieving the data"})
//     }
// })


//doctors who has more than 4 patients 
// router.get('/',async(req,res)=>{
//     const grouped=await prisma.patient.groupBy({
//         by:['doctorId'],
//         _count:{
//             doctorId:true
//         },
//         having:{
//            doctorId :{
//                 _count:{gt:4}
//             }
//         }

//     })
//     const docIds=grouped.map(g=>g.doctorId);
//     const doctors=await prisma.doctor.findMany({
//         where:{id:{in:docIds}},
//         select:{
//             id:true,
//             name:true,
//             departmentId:true
//         }
//     });
//     const result=doctors.map(doc=>{
//         const g=grouped.find(x=>x.doctorId===doc.id);
//         return{
//             docId:doc.id,
//             name:doc.name,
//             departmentId:doc.departmentId,
//             patientCnt:g._count.doctorId
//         }
//     })
//     res.json(result);
// })


//Pagination With Total Count
router.get('/',async(req,res)=>{
    const page=Number(req.query.page)||1;
    const pageSize=Number(req.query.pageSize||10,50);
    const skip=(page-1)*pageSize;
    const [patients,totalItems]=await Promise.all([
        prisma.patient.findMany({
            skip:skip,
            take:pageSize,
            include:{
                doctor:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            },
            orderBy:{
                id:'asc'
            }
            
        }),
        prisma.patient.count()
    ]);
    const totalPages=Math.ceil(totalItems/pageSize);

    res.json({
        data:patients,
        meta:
        {page,
        pageSize,
        totalItems,
        totalPages,
        hasNext:page<totalPages,
        hasPrev:page>1
        }
    })
})
//get json from orm or db itself 






//Sort doctors by number of patients
router.get('/',async(req,res)=>{
    try{
    const data=await prisma.patient.groupBy({
        by:['doctorId'],
        _count:{
            doctorId:true
        },
        orderBy:{
            _count:{
                doctorId:'desc'
            }
        },
        take:5
    })
    console.log(data);
    const doctorIds= data.map(d=>d.doctorId)
    console.log(doctorIds);
    const docs=await prisma.doctor.findMany({
        where:{id:{in:doctorIds}},
        select:{
            id:true,
            name:true,
            department:true
        }
    })
    console.log(docs);
    const ans=docs.map(d=>{
        const g=data.find(x=>x.doctorId===d.id);
        return{
            docId:d.id,
            docName:d.name,
            dept:d.department,
            patientC:g._count.doctorId
        }
    })
    console.log(ans);
    res.json(ans);
}catch(err){
    res.json({error:"errrrrrr"})
}
})




//insert a new patient
router.post('/',async(req,res)=>{
    try{
        const {name,doctorId}=req.body;
        if(!name||!doctorId){
            return res.status(400).json({error:"name & docID are required"});
        }
        const docExists=await prisma.doctor.findUnique({
            where:{id:Number(doctorId)}
        });
        if(!docExists){return res.status(404).json({error:"doc not found"})}
        const newPatient=await prisma.patient.create({
            data:{
                name,
                doctorId:Number(doctorId)
            }
        });
        res.status(201).json({message:"succesfully created "})
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
})


router.patch('/:id',async(req,res)=>{
    try{
        const {id}=req.params;
        const {name,doctorId}=req.body;
        const patient=await prisma.patient.findUnique({
            where :{id:Number(id)}
        });
        if(!patient){
            return res.status(404).json({error:"patient not found"})
        }
        if(doctorId){
            const doctorCheck=await prisma.doctor.findUnique({
                where:{id:Number(doctorId)}
            });
            if(!doctorCheck){return res.status(404).json({error:"doc not found"})}
        }
        const updated=await prisma.patient.update({
            where:{id:Number(id)},
            data:{
                name:name??patient.name,
                doctorId:doctorId?Number(doctorId):patient.doctorId
            }
        });
        res.json({message:"patient updated",patient:updated});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }   
})


router.delete('/:id',async(req,res)=>{
    try{
    const {id}=req.params;
    const patientCheck=await prisma.patient.findUnique({
        where:{id:Number(id)}
    })
    if(!patientCheck){res.status(404).json({error:"patient not foud"})}
    await prisma.appointment.deleteMany({where:{
        patientId:Number(id)}
    })
    await prisma.patient.delete({
        where:{id:Number(id)}
    })
    res.json({message:"patient deleted successfully"})
}catch(err){
    res.status(500).json(err.message)
}
})






export default router;