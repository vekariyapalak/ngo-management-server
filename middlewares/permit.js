const permit = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "ERROR",
        message: "Authentication required",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "ERROR",
        message: "Access denied",
      });
    }
    next();
  };
};

export default permit;