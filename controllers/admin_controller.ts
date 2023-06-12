import Admin  from "../models/admin_model";
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

export const verifyLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email: string = req.body.email;
      const password: string = req.body.password;
      const adminData = await Admin.findOne({email:email });
      if (adminData) {
        const passwordCheck = await bcrypt.compare(password, adminData.password); // comparing database bcrypt with Student-typed password
        if (passwordCheck) {
          const token = await jwt.sign(
            { student_id: adminData._id, type: "admin" },
            process.env.SECRET_KEY!,
            {
              expiresIn: "2d",
            }
          );
          res.cookie("adminjwt", token, {
            httpOnly: true,
            maxAge: 48 * 60 * 60 * 1000,
          });
          adminData.token = token;
          res.status(200).json({ token: adminData.token, status: true });
        } else {
          res.status(400).send({ message: "Password is incorrect!" });
        }
      } else {
        res.status(400).send({
          message: "E-mail is not registered! You are not an admin..",
        });
      }
    } catch (error) {
      res.status(400).json({ message: "Something went wrong", status: false });
    }
  };
