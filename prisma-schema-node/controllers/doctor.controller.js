//doctor.controller.js
import prisma from "../prismaClient.js";
export const createDoctor = async (req, res) => {
  try {
    const existingDoctor = await prisma.doctor.findUnique({
  where: { userId: req.body.userId },
});

if (existingDoctor) {
  return res.status(409).json({
    error: "Doctor already exists",
  });
}
    const doctor = await prisma.doctor.create({
      data: req.body,
    });
    res.status(201).json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


/**
 * DOCTOR: Get own profile
 */
export const getDoctorProfile = async (req, res) => {
  const doctor = await prisma.doctor.findUnique({
    where: { userId: req.user.id }
  });

  res.json(doctor);
};

/**
 * DOCTOR: Get own patients
 */
export const getDoctorPatients = async (req, res) => {
  const doctor = await prisma.doctor.findUnique({
    where: { userId: req.user.id },
    include: { patients: true }
  });

  res.json(doctor.patients);
};
