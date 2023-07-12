// import { NextFunction } from "express";

// export const isLogin = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const authHeader = req.headers.authorization;
//         const token = authHeader && authHeader.split(' ')[1];
//         if (token) {
//           next();
//         } else {
//             res.status(200).json({ status: true });
//         }
//       } catch (error) {
//        next(error);
//       }
//   };


import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
interface ITokenPayload {
    iat: number;
    exp: number;
    student_id: string;
  }
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
                  (err: any | null, decoded: any) => {
                    if (err) {                    
                      return res.status(401).json({
                        message: "auth failed",
                        Status: false,
                      });
                    } else {
                      const { student_id } = decoded as ITokenPayload;
                      req.body.userId = student_id;
                      next();
                    }
                  }
        
                );
            // const decodedToken = jwt.verify(token, process.env.SECRET_KEY!) as JwtPayload & { student_id: string };
            // req.body.userId = decodedToken.student_id;;
            // next();
        }


        // if (!authHeader) {
        //   return res.status(401).send({
        //     message: "auth failed",
        //     Status: false,
        //   });
        // }
        // const [, token] = authHeader.split(" ");
        // jwt.verify(
        //   token,
        //   process.env.SECRET_KEY,
        //   (err: object | null, decoded: object | undefined) => {
        //     if (err) {                    
        //       return res.send({
        //         message: "auth failed",
        //         Status: false,
        //       });
        //     } else {
        //       const {  } = decoded as ITokenPayload;
        //       req.body.userId = student_id;
        //       next();
        //     }
        //   }

        // );
    } catch (error) {
        return res.status(401).send({
            message: "auth failed",
            success: false,
        });
    }
};