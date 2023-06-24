import Teacher from "../models/teacher_model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
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
export const checkTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mobile = parseInt(req.body.mobile)
      const data = await Teacher.findOne({ mobile: mobile });
      if (data) {
        if (data.access) {
            if (data.approval) {
                res
                  .status(201)
                  .send({ message: "Tutor Already Registered", status: false, number: req.body.mobile });
            } else {
                res
                  .status(201)
                  .send({ message: "Your account is not approved", status: false, number: req.body.mobile });
            }
        } else {
          res.status(201).json({ message: "You are blocked by admin", status: false });
        }
      } else {
        // return success and give response true to send otp
        res.status(200).json({ number: req.body.mobile, status: true });
      }
    } catch (error) {
      next(error)
    }
  }

  //Insert a new Teacher  --signup page
export const insertTeacher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mobile = parseInt(req.body.mobile)
      const data = await Teacher.findOne({ mobile: mobile });
      if (data) {
        res
          .status(401)
          .send({ message: "E-mail Already Registered", status: false });
      } else {
        const psw = await securePassword(req.body.password);
        const teacher = new Teacher({
          fullName: req.body.fullName,
          email: req.body.email,
          mobile: mobile,
          password: psw,
          certificate:req.body.certificate
        });
        await teacher.save();
  
        //jwt token create
        const token = await jwt.sign(
          { student_id: teacher._id, type: "tutor" },
          process.env.SECRET_KEY!,
          {
            expiresIn: "2d",
          }
        );
        teacher.token = token;
        if (teacher.token) {
          res.cookie("tutorjwt", token, {
            httpOnly: true,
            maxAge: 48 * 60 * 60 * 1000,
          });
          // return success and give response the jwt token
          res.status(200).json({ token: teacher.token, status: true });
        } else {
          res.status(400).send({
            message: "Registration failed, please try again!",
            status: false,
          });
        }
      }
    } catch (error) {
      next(error)
    }
  }
  
