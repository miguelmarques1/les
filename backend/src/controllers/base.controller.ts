import { Response } from "express";

export abstract class BaseController {
  protected success(res: Response, data: any, statusCode: number = 200) {
    return res.status(statusCode).json({
      data: data,
      error: false,
      message: null,
    });
  }

  protected error(res: Response, error: any, statusCode: number = 500) {
    return res.status(error.statusCode ?? statusCode).json({
      data: null,
      error: true,
      message: error.message,
    });
  }
}
