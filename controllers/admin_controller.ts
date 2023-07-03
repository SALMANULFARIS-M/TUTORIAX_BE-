import Admin from "../models/admin_model";
import Student from "../models/student_model";
import Teacher from "../models/teacher_model";
import Course from "../models/course_model";
import Coupon from "../models/coupon_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


export const verifyLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;
    const adminData = await Admin.findOne({ email: email });
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
        res.status(401).send({ message: "Password is incorrect!", status: true });
      }
    } else {
      res.status(401).send({
        message: "E-mail is not registered! You are not an admin..",
        status: true
      });
    }
  } catch (error) {
    next(error)
  }
};

export const addCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const title = req.body.title
    const data = await Course.findOne({ title: title });
    if (data) {
      res
        .status(400)
        .send({ message: "Course Already Exist", status: false });
    } else {
      const date = new Date(req.body.date);
      const course = new Course({
        title: title,
        author: req.body.author,
        date: date,
        price: req.body.price,
        image_id: req.body.thumbnail,
        video_id: req.body.video,
        description: req.body.description
      });
      await course.save().then(() => {
        res.status(200).json({ message: "Successfully added a course", status: true });
      }).catch(() => {
        res.status(400).json({ message: "Something went wrong", status: false });
      });
    }
  } catch (error) {
    next(error)
  }
};

export const getAllCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    Course.find({
      $or: [
        { report: { $exists: false } },
        { $expr: { $lt: [{ $size: "$report" }, 2] } },
      ],
    }).then((result) => {
      const data = result
      res.status(200).json({ data, status: true });
    }).catch((error) => {
      console.log(error);
    })

  } catch (error) {
    next(error)
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {

  try {
    Course.findByIdAndDelete({ _id: req.params.id }).then((result) => {
      res.status(200).json({ thumbnailURL: result?.image_id, videoURL: result?.video_id, message: "Successfully deleted", status: true });
    }).catch((error) => {
      console.log(error);
    })
  } catch (error) {
    next(error)
  }
};


export const getCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: string = req.params.id
    Course.findOne({
      $and: [
        { _id: id },
        {
          $or: [
            { report: { $exists: false } },
            { $expr: { $lt: [{ $size: "$report" }, 2] } }
          ]
        }
      ]
    }).then((result) => {
      if (result) {
        res.status(200).json({ course: result, status: true });
      } else {
        res.status(404).json({ message: 'Course not found', status: false });
      }
    }).catch((error) => {
      next(error);
    })
  } catch (error) {
    next(error)
  }
};

export const editCourse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const date = new Date(req.body.date);
    Course.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      author: req.body.author,
      date: date,
      price: req.body.price,
      image_id: req.body.thumbnail,
      video_id: req.body.video,
      description: req.body.description
    })
      .then((result) => {
        res.status(200).json({ message: "Successfully changed", status: true });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error)
  }
};

export const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    Student.find().then((result) => {
      const data = result
      res.status(200).json({ data, status: true });
    }).catch((error) => {
      console.log(error);
    })

  } catch (error) {
    next(error)
  }
};

export const blockStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flag = req.body.access
    if (flag) {
      Student.findByIdAndUpdate(req.params.id, {
        access: false
      }).then((result) => {
        res.status(200).json({ Message: "Blocked the student", status: true });
      }).catch((error) => {
        console.log(error);
      })
    } else {
      Student.findByIdAndUpdate(req.params.id, {
        access: true
      }).then((result) => {
        res.status(200).json({ Message: "Unblocked the student", status: true });
      }).catch((error) => {
        console.log(error);
      })
    }
  } catch (error) {
    next(error)
  }
};

export const getAllTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    Teacher.find().then((result) => {
      const data = result
      res.status(200).json({ data, status: true });
    }).catch((error) => {
      console.log(error);
    })
  } catch (error) {
    next(error)
  }
};

export const getTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: string = req.params.id
    Teacher.findById(id).then((result) => {
      res.status(200).json({ tutor: result, status: true });
    }).catch((error) => {
      console.log(error, "dfds");
    })

  } catch (error) {
    next(error)
  }
};

export const blockTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const flag = req.body.access
    if (flag) {
      Teacher.findByIdAndUpdate(req.params.id, {
        access: false
      }).then((result) => {
        res.status(200).json({ Message: "Blocked the tutor", status: true });
      }).catch((error) => {
        console.log(error);
      })
    } else {
      Teacher.findByIdAndUpdate(req.params.id, {
        access: true
      }).then((result) => {
        res.status(200).json({ Message: "Unblocked the tutor", status: true });
      }).catch((error) => {
        console.log(error);
      })
    }
  } catch (error) {
    next(error)
  }
};

export const approveTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    Teacher.findByIdAndUpdate(req.params.id, {
      approval: true
    }).then((result) => {
      res.status(200).json({ Message: "Tutor has approved for our website", status: true });
    }).catch((error) => {
      console.log(error);
    })
  } catch (error) {
    next(error)
  }
};

export const getCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Coupon.find({}).then((result) => {
      res.status(200).json({ coupons: result, status: true });
    }).catch((error) => {
      next(error);
    });
  } catch (error) {
    next(error)
  }
};

export const addCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.body.code;
    const existData = await Coupon.findOne({
      code: { $regex: name, $options: "i" },
    });
    if (!existData) {
      const percentage = req.body.discountPercentage;
      const max_dis = req.body.maxDiscount;
      const Amount = req.body.minAmount;
      const date = new Date(req.body.expDate);
      const coupon = new Coupon({
        code: name,
        discountPercentage: percentage,
        maxDiscount: max_dis,
        minAmount: Amount,
        expDate: date,
      });
      await coupon.save().then((result: any) => {
        res.status(200).json({ coupons: result, status: true });
      }).catch((error) => {
        next(error);
      });;
    } else {
      res.status(200).json({ message: "coupon Already Exist", status: false });
    }
  } catch (error) {
    next(error)
  }
};

export const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Coupon.findByIdAndDelete({ _id: req.params.id }).then((result: any) => {
      res.status(200).json({ status: true });
    }).catch((error) => {
      next(error);
    });;;

  } catch (error) {
    next(error)
  }
};