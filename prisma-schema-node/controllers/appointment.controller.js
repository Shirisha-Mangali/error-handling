
import prisma from "../prismaClient.js";
export const bookAppointment = async (req, res) => {
  const { doctorId, date } = req.body;
    console.log(req.user);
  const patient = await prisma.patient.findUnique({
    where: { userId: req.user.id },
  });

  const appointment = await prisma.appointment.create({
    data: {
      doctorId,
      patientId: patient.id,
      date,
    },
  });

  res.status(201).json(appointment);
};

export const getMyAppointments = async (req, res) => {
  const patient = await prisma.patient.findUnique({
    where: { userId: req.user.id },
    include: {
      appointments: true,
    },
  });

  res.json(patient.appointments);
};

