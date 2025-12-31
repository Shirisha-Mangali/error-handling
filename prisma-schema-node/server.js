//server.js
import express from "express";
import dotenv from "dotenv";

const env = process.env.NODE_ENV || "development";
dotenv.config({
 path: `.env.${env}`,
  override: true,  
})

// if (process.env.NODE_ENV !== "production") {
//   const env = process.env.NODE_ENV || "development";
//   dotenv.config({ path: `.env.${env}`, override: true });
// }

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
import globalErrorHandler from "./middlewares/error.middleware.js";
import path from "path";
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get("/", (req, res) => res.send("OK"));
app.get("/home",(req,res)=> res.send("home"));

console.log("ENV:", process.env.NODE_ENV);
console.log("DB:", process.env.DATABASE_URL);

// Session needed for Passport
//app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
//passport.use(jwtStrategy);

// Register JWT strategy
passport.use(jwtStrategy);
app.use(passport.initialize());//For every request, Passport is allowed to attach data to req
//app.use(passport.session());


app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);


// Routes
app.use("/auth", authRoutes);
app.use("/doctors", doctorRoutes);
app.use("/patient",patientRoutes);
app.use("/admin",adminRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

//app.listen(3000, () => console.log("Server running on "));

// if (process.env.NODE_ENV !== "test") {
//   app.listen(3000, () => {
//     console.log("Server running on port 3000");
//   });
// }

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}





//app.use("/uploads/doctors",express.static("uploads"));
//without multer
app.post("/upload-test",(req,res)=>{
  console.log("req.headers: ",req.headers);
  console.log("req.body: ",req.body);
  console.log("req.file:", req.file);
  console.log("req.files:", req.files);

  res.json({
    body:req.body,
    file:req.file,
    files:req.files,
  });
});



app.use(globalErrorHandler);

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

export default app;






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