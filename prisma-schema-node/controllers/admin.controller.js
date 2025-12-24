import prisma from "../prismaClient.js";

/**
 * ADMIN: Get all users
 */
export const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

/**
 * ADMIN: Update user role
 */
export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data: { role }
  });

  res.json(user);
};




/**
 * ADMIN → Promote user to DOCTOR
 */
export const promoteUserToDoctor = async (req, res) => {
  try {
    const { userId, departmentId } = req.body;

    // 1️ Validate user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2️ Prevent double promotion
    if (user.role === "DOCTOR") {
      return res.status(400).json({ error: "User is already a doctor" });
    }

    // 3️ Update role
    await prisma.user.update({
      where: { id: userId },
      data: { role: "DOCTOR" },
    });

    // 4️ Create doctor profile
    const doctor = await prisma.doctor.create({
      data: {
        name: user.name,
        userId: user.id,
        departmentId,
      },
    });

    res.json({
      message: "User promoted to doctor successfully",
      doctor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getAllDoctors = async (req, res) => {
  const doctors = await prisma.doctor.findMany({
    include: {
      department: true,
    },
  });
  res.json(doctors);
};

