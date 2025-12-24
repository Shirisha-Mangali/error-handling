import prisma from "../prismaClient.js";

async function main() {
  // 1. Create Departments
  const departments = await prisma.department.createMany({
    data: [
      { deptName: "Cardiology" },
      { deptName: "Orthopedics" },
      { deptName: "Neurology" },
      { deptName: "Pediatrics" }
    ],
    skipDuplicates: true,
  });

  const allDepts = await prisma.department.findMany();

  // 2. Create Users for Doctors
  const doctorUsers = [];
  for (let i = 1; i <= 50; i++) {
    doctorUsers.push({
      name: `Doctor User ${i}`,
      email: `doctor${i}@hospital.com`,
      role: "DOCTOR",
    });
  }
  await prisma.user.createMany({ data: doctorUsers });
  const allDoctorUsers = await prisma.user.findMany({ where: { role: "DOCTOR" } });

  // 3. Create Doctors
  const doctorData = [];
  for (let i = 0; i < allDoctorUsers.length; i++) {
    doctorData.push({
      name: `Doctor ${i + 1}`,
      departmentId: allDepts[i % allDepts.length].id,
      userId: allDoctorUsers[i].id, // assign userId here
    });
  }
  await prisma.doctor.createMany({ data: doctorData });
  const allDoctors = await prisma.doctor.findMany();

  // 4. Create Users for Patients
  const patientUsers = [];
  for (let i = 1; i <= 200; i++) {
    patientUsers.push({
      name: `Patient User ${i}`,
      email: `patient${i}@hospital.com`,
      role: "PATIENT",
    });
  }
  await prisma.user.createMany({ data: patientUsers });
  const allPatientUsers = await prisma.user.findMany({ where: { role: "PATIENT" } });

  // 5. Create Patients
  const patientData = [];
  for (let i = 0; i < allPatientUsers.length; i++) {
    patientData.push({
      name: `Patient ${i + 1}`,
      doctorId: allDoctors[i % allDoctors.length].id,
      userId: allPatientUsers[i].id, // assign userId here
    });
  }
  await prisma.patient.createMany({ data: patientData });
  const allPatients = await prisma.patient.findMany();

  // 6. Create Appointments
  const appointmentsData = [];
  for (let i = 0; i < 200; i++) {
    const p = allPatients[i % allPatients.length];
    const d = allDoctors[i % allDoctors.length];
    appointmentsData.push({
      doctorId: d.id,
      patientId: p.id,
      date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    });
  }
  await prisma.appointment.createMany({ data: appointmentsData });

  // 7. Create Medicines
  const medicines = [
    { name: "Paracetamol", stock: 200, price: 30 },
    { name: "Amoxicillin", stock: 150, price: 120 },
    { name: "Ibuprofen", stock: 100, price: 50 },
    { name: "Metformin", stock: 80, price: 200 },
    { name: "Omeprazole", stock: 60, price: 180 },
  ];
  await prisma.medicine.createMany({ data: medicines });

  // 8. Create Lab Tests
  const labTestTypes = ["Blood Test", "X-Ray", "MRI", "Urine Test"];
  const labTestsData = [];
  for (let i = 0; i < 100; i++) {
    const patient = allPatients[i % allPatients.length];
    labTestsData.push({
      patientId: patient.id,
      type: labTestTypes[i % labTestTypes.length],
      result: Math.random() > 0.5 ? "Normal" : "Abnormal",
    });
  }
  await prisma.labTest.createMany({ data: labTestsData });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
