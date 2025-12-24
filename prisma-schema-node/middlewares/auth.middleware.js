import prisma from "../prismaClient.js";

export const authenticate = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"]; // For now, simple header-based auth
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user; // attach user to request for later use
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
