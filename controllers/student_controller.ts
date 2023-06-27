import Student from "../models/student_model";
import Connection from "../models/chat_connection";
import Chat from "../models/chat_content";
import Teacher from "../models/teacher_model";
import Order from "../models/order_model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
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
    next(error)
  }
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
      const token = jwt.sign(
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
    next(error)
  }
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
          const token = jwt.sign(
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
    next(error)
  }
};

export const savePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mobile: Number = parseInt(req.body.mobile)
    const psw: string = await securePassword(req.body.password);
    await Student.findOneAndUpdate({ mobile: mobile }, { password: psw }).then((result) => {
      res.status(200).json({ message: "success", status: true });
    });
  } catch (error) {
    next(error)
  }
}

export const saveOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: any = req.params.id
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload & { student_id: string };
    const userId = decodedToken.student_id;
    const order = new Order({
      payment_id: req.body.stripeToken,
      course_id: req.body.courseId,
      student_id: userId,
      amount: req.body.amount
    });
    await order.save().then((response) => {
      Student.findByIdAndUpdate(response.student_id,
        { $push: { purchased_course: response.course_id } },
        { new: true }
      ).then((updatedStudent: any) => {
        if (updatedStudent) {
          res.status(200).json({ message: "success", id: response.course_id, status: true });
        }
      })
        .catch((error) => {
          console.error("Error updating purchased course:", error);
        });
    });

  } catch (error) {
    next(error)
  }
}

export const checkPurchased = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const token: any = req.body.token
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload & { student_id: string };
    const studentId = decodedToken.student_id;
    Student.findOne({ _id: studentId, purchased_course: req.body.courseId })
      .then((foundStudent: any) => {
        if (foundStudent) {
          res.status(200).json({ message: "Course exists in purchased courses", status: true });
        } else {
          res.status(200).json({ message: "Course does not exist in purchased courses", status: false });
        }
      })
      .catch((error) => {
        console.error("Error searching for student:", error);
      });

  } catch (error) {
    next(error)
  }
}

export const getAllTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    Teacher.find({ approval: true, access: true }).then((result) => {
      const data = result
      res.status(200).json({ data, status: true });
    }).catch((error) => {
      console.log(error);
    })
  } catch (error) {
    next(error)
  }
};

export const chatConnection = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const token: any = req.body.student;
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload & { student_id: string };
    const studentId = decodedToken.student_id;
    const connection: { student: ObjectId; teacher: ObjectId } =
      { student: new ObjectId(studentId), teacher: new ObjectId(req.body.tutor) };

    const existingConnection = await Connection.findOne({
      "connection.student": connection.student,
      "connection.teacher": connection.teacher
    });
    if (existingConnection) {
      res.status(200).json({ existingConnection, status: true });
    } else {
      const newConnection = new Connection({ connection });
      await newConnection.save();
      res.status(200).json({ newConnection, status: true });
    }
  } catch (error) {
    next(error)
  }
};

export const getAllChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: any = req.params.id;
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload & { student_id: string };
    const id = decodedToken.student_id;
    const connections = await Connection.find({ "connection.student": id }).sort({ updatedAt: -1 }).populate({
      path: "connection.teacher",
      model: "Teacher",
    }).populate('last_message');

    res.status(200).json({ connections: connections, status: true });
  } catch (error) {
    next(error)
  }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    const room = await Connection.findById(id).populate({
      path: 'connection.student',
      model: 'Student'
    }).populate({
      path: 'connection.teacher',
      model: 'Teacher'
    })
    const messages = await Chat.find({ connection_id: id }).populate('connection_id') .populate({
      path: 'connection_id',
      populate: {
        path: 'connection.student',
        model: 'Student'
      }
    })
    .populate({
      path: 'connection_id',
      populate: {
        path: 'connection.teacher',
        model: 'Teacher'
      }
    });
    res.status(200).json({ messages: messages, status: true, room: room });
  } catch (error) {
    next(error)
  }
};

export const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newChatContent = new Chat({
      connection_id: req.body.connection,
      from: req.body.sender,
      to: req.body.receiver,
      text: req.body.text,
    });

    // Save the document to the database
    newChatContent.save()
      .then((savedChatContent) => {
        console.log('New Chat_Content document saved:', savedChatContent);
        Connection.findByIdAndUpdate(savedChatContent.connection_id, { last_message: savedChatContent._id }).then((result:any)=>{
          res.status(200).json({ data: savedChatContent, status: true,result,id:req.body.connection });
        }).catch((error) => {
          console.error('Error updating last message:', error);
        });
      })
      .catch((error) => {
        console.error('Error saving Chat_Content document:', error);
      });
  } catch (error) {
    next(error)
  }
};