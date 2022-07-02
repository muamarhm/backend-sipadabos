import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../utils/custom-error.model'

function handleError(
  err: TypeError | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let customError = err

  if (!(err instanceof CustomError)) {
    customError = new CustomError(
      'Oh no, this is embarrasing. We are having troubles my friend'
    )
  }

  res.status((customError as CustomError).status).send(customError)
}

export default handleError
