//server.js
import express from "express";
import dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";
dotenv.config({
 path: `.env.${env}`,
  override: true,  
})

import prisma from "./prismaClient.js";
import practiceQueries from "./controllers/practice.js";
import filterQueries from "./controllers/filter.js";
import pracQueries from "./controllers/prac.js";
import doctorRoutes from "./routes/doctor.routes.js";
import passport from "passport";
import { jwtStrategy } from "./middlewares/jwt.strategy.js";
import authRoutes from "./routes/auth.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import adminRoutes from "./routes/admin.routes.js";
const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("OK"));


console.log("ENV:", process.env.NODE_ENV);
console.log("DB:", process.env.DATABASE_URL);

// Session needed for Passport
//app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
//passport.use(jwtStrategy);

// Register JWT strategy
passport.use(jwtStrategy);
app.use(passport.initialize());//For every request, Passport is allowed to attach data to req
//app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/doctors", doctorRoutes);
app.use("/patient",patientRoutes);
app.use("/admin",adminRoutes);


app.get(
  "/debug-jwt",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      message: "JWT OK",
      user: req.user,
    });
  }
);


//app.use("/doctors", doctorRoutes);
app.use("/p", practiceQueries);
app.use('/f',filterQueries);
app.use('/q',pracQueries);
// app.use("/patient", patientRoutes);
// app.use("/appointments", appointmentRoutes);
// app.use("/labtests", labTestRoutes);
// app.use("/medicines", medicineRoutes);


app.listen(3000, () => console.log("Server running on "));





//////implement pagination, pg no,pg size 







/*
function getData(data){
    return data.length;
}
app.get("/doctor",async(req,res)=>{
    const r=await prisma.doctor.findMany({})
    const c=getData(r);
    res.json({"patient_count": c});
})



// app.get("/doctor",async(req,res)=>{
//     const r=await prisma.doctor.findUnique({
//         where:{id:Number(req.id)},
//         includes:{
//             patient
//         }
//     })
//     res.json(r);
// })

// app.get("/doctor",async(req,res)=>{
//     const r=await prisma.doctor.count({
//         where:{id:1}
//     })
//     console.log(r);
//     res.send(r);
// })



app.post("/doctor", async (req, res) => {
  const doctor = await prisma.doctor.create({
    data: req.body,
  })
  res.json(doctor)
})






app.post("/patient", async (req, res) => {
  const patient = await prisma.patient.create({
    data: req.body,
  })
  res.json(patient)
})

app.get("/patients", async (req, res) => {
  const patients = await prisma.patient.findMany({
    include: {
      doctor: true,
    },
  })
  res.json(patients)
})

app.get("/doctor/:id", async (req, res) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      patients: true,
    },
  })
  res.json(doctor)
})

app.get("/patient/:id/appointments", async (req, res) => {
  const data = await prisma.patient.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      appointments: {
        include: { doctor: true },
      }
    },
  })
  res.json(data)
})


app.get("/patient/:id/labtests", async (req, res) => {
  const tests = await prisma.labTest.findMany({
    where: { patientId: Number(req.params.id) },
    include: {
      patient: true,
    },
  })
  res.json(tests)
})


app.get("/medicines", async (req, res) => {
  const meds = await prisma.medicine.findMany()
  res.json(meds)
})


app.get("/patient/:id/summary", async (req, res) => {
  const data = await prisma.patient.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      doctor: true,
      appointments: true,
      labTests: true,
    }
  })
  res.json(data)
})
*/