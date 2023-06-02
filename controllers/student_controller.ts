import Student from "../models/student_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Request, Response,NextFunction } from "express";

//Password bcryption
const securePassword = async (password: string): Promise<string> => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

//Insert a new Student  --signup page
export const InsertStudent =async (req:Request,res:Response,next:NextFunction) => {
    try {
        const data = await Student.findOne({ email: req.body.email });
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
            mobile:req.body.mobile,
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
            res.cookie("jwt", token, {
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
        res.status(400).json({ message: "Something went wrong", status: true });
      }
}
