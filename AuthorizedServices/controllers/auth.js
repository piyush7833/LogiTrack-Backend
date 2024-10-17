import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Driver from "../models/Driver.js";
import { getAsync, setAsync, delAsync } from "../config/redis.js";

export const signup = async (req, res) => {
  const { name, email, password, role, licenseNumber, phone, secretKey } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let driverId = null;

    if (role === "driver") {
      const driver = new Driver({
        licenseNumber
      });
      await driver.save();
      driverId = driver._id;
    }

    const user = new User({ name, email, password, role, driverId, phone, secretKey });
    await user.save();

    res.status(201).json({
      message: "User created successfully",
<<<<<<< HEAD
=======
      token,
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

<<<<<<< HEAD
    let driverId = null;
    if (user.role === "driver") {
      const driver = await Driver.findOne({ userId: user._id });
      driverId = driver._id;
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, driverId: driverId },
=======
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
<<<<<<< HEAD
=======
    let driverId = null;
    if (user.role === "driver") {
      const driver = await Driver.findOne({ userId: user._id });
      driverId = driver._id;
    }
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
    res.status(200).json({
      message: "Login successful",
      token,
      name: user.name,
      role: user.role,
      driverId: driverId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const authMe = async (req, res) => {
  try {
    const cachedUser = await getAsync(`user:${req.user.id}`);
    if (cachedUser) {
      return res.status(200).json({ data: { user: JSON.parse(cachedUser) }, message: "User found successfully" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const response = {
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
    };

    await setAsync(`user:${user._id}`, JSON.stringify(response), 'EX', 3600); // Cache for 1 hour

    res.status(200).json({ data: { user: response }, message: "User found successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const cachedUser = await getAsync(`user:${id}`);
    if (cachedUser) {
      return res.status(200).json(JSON.parse(cachedUser));
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
<<<<<<< HEAD

=======
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
    const response = {
      id: user._id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    await setAsync(`user:${user._id}`, JSON.stringify(response), 'EX', 3600); // Cache for 1 hour

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
<<<<<<< HEAD
  const { id } = req.user;
  const { name, email, password, role,phone } = req.body;
=======
  const { id } = req.params;
  const { name, email, password, role, licenseNumber, preferredVehicleType } = req.body;
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.phone = phone || user.phone;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

<<<<<<< HEAD
=======
    if (user.role === "driver") {
      const driver = await Driver.findOne({ userId: id });
      if (driver) {
        driver.licenseNumber = licenseNumber || driver.licenseNumber;
        await driver.save();
      }
    }

>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
    await user.save();

    const response = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    if (user.driverId) {
      response.driverInfo = user.driverId;
    }

    await setAsync(`user:${user._id}`, JSON.stringify(response), 'EX', 3600); // Update cache

    res.status(200).json({ data: { user: response }, message: "User updated successfully" });
  } catch (error) {
<<<<<<< HEAD
    console.log(error)
=======
>>>>>>> 78f242ff552819ca17cb1507440d1575b9e67c69
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
