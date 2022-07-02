import { Request, Response } from 'express'
import { RegisterValidation } from '../validation/register.validation'
import { Prisma, PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
const prisma = new PrismaClient()

export const Register = async (req: Request, res: Response) => {
  const body = req.body

  const { error } = RegisterValidation.validate(body)

  if (error) {
    return res.status(400).send(error.details)
  }

  try {
    const { password, ...user } = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: await bcryptjs.hash(body.password, 10),
      },
    })
    res.send(user)
  } catch (e) {
    let errorMessage = ''
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        errorMessage =
          'There is a unique constraint violation, a new user cannot be created with this email'
      }
      return res.status(400).send(errorMessage)
    }
  }
}
