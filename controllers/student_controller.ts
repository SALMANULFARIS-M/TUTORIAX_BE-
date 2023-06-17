import Student from "../models/student_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

//Password bcryption
const securePassword = async (password: string): Promise<string> => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

//check the Student already exist
export const checkStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mobile = parseInt(req.body.mobile)
    const data = await Student.findOne({ mobile: mobile });
    if (data) {
      if (data.access) {
        res
          .status(201)
          .send({ message: "Student Already Registered", status: false, number: req.body.mobile });
      } else {
        res.status(201).json({ message: "You are blocked by admin", status: false });
      }
    } else {
      // return success and give response true to send otp
      res.status(200).json({ number: req.body.mobile, status: true });
    }
  } catch (error) {
    next(error)  }
}

//Insert a new Student  --signup page
export const insertStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mobile = parseInt(req.body.mobile)
    const data = await Student.findOne({ mobile: mobile });
    if (data) {
      res
        .status(400)
        .send({ message: "E-mail Already Registered", status: false });
    } else {
      const psw = await securePassword(req.body.password);
      const student = new Student({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: mobile,
        password: psw,
      });
      await student.save();

      //jwt token create
      const token = await jwt.sign(
        { student_id: student._id, type: "student" },
        process.env.SECRET_KEY!,
        {
          expiresIn: "2d",
        }
      );
      student.token = token;
      if (student.token) {
        res.cookie("studentjwt", token, {
          httpOnly: true,
          maxAge: 48 * 60 * 60 * 1000,
        });
        // return success and give response the jwt token
        res.status(200).json({ token: student.token, status: true });
      } else {
        res.status(400).send({
          message: "Registration failed, please try again!",
          status: false,
        });
      }
    }
  } catch (error) {
    next(error)  }
}

export const verifyLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mobile: string = req.body.mobile;
    const password: string = req.body.password;
    const studentData = await Student.findOne({ mobile: mobile });
    if (studentData?.access) {
      if (studentData) {
        const passwordCheck = await bcrypt.compare(password, studentData.password); // comparing database bcrypt with Student-typed password
        if (passwordCheck) {
          const token = await jwt.sign(
            { student_id: studentData._id, type: "student" },
            process.env.SECRET_KEY!,
            {
              expiresIn: "2d",
            }
          );
          res.cookie("studentjwt", token, {
            httpOnly: true,
            maxAge: 48 * 60 * 60 * 1000,
          });
          studentData.token = token;
          res.status(200).json({ token: studentData.token, status: true });
        } else {
          res.status(400).send({ message: "Password is incorrect!" });
        }
      } else {
        res.status(400).send({
          message: "E-mail is not registered! Please signup to continue..",
        });
      }
    } else {
      res.status(201).json({ message: "You are blocked by admin", status: false });
    }
  } catch (error) {
    next(error)  }
};

export const savePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mobile = parseInt(req.body.mobile)
    const psw = await securePassword(req.body.password);
    await Student.findOneAndUpdate({ mobile: mobile }, { password: psw });
    res.status(200).json({ message: "success", status: true });
  } catch (error) {
    next(error)  }
}

