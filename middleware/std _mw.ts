
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const isLoggin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader: string | undefined = req.headers.authorization;
    const token: string | undefined = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        message: "auth failed",
        Status: false,
      });
    } else {
      jwt.verify(
        token,
        process.env.SECRET_KEY as string,
        (err: any, decoded: any) => {
          if (err) {
            return res.status(401).json({
              message: "auth failed",
              Status: false,
            });
          } else {
            const { student_id } = decoded as JwtPayload & { student_id: string };
            req.body.userId = student_id;
            next();
          }
        }
      );
    }
  } catch (error) {
    return res.status(401).send({
      message: "auth failed",
      success: false,
    });
  }
};