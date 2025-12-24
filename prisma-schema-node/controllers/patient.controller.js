import prisma from "../prismaClient.js";

/**
 * ADMIN: Get all patients
 */
export const getAllPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PATIENT: Get own profile
 */
export const getMyProfile = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id },
      include: {
        user: true
      }
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PATIENT: Get appointments
 */
export const getMyAppointments = async (req, res) => {
  const appointments = await prisma.appointment.findMany({
    where: { patient: { userId: req.user.id } }
  });

  res.json(appointments);
};