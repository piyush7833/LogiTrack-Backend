import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // console.log(req.headers)
  const token = req.headers["authorization"]?.split(" ")[1];
  // console.log(token)
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.sendStatus(403);
  }
  next();
}

export const isNotAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    console.log("object")
    return res.sendStatus(403);
  }
  next();
}


