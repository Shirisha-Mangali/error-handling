//role.middleware.js
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user; // <-- must be set after authentication
    console.log("REQ.USER:", req.user);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }
    next();
  };
};
