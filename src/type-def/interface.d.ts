import { Request, Response } from 'express'
import { CustomError } from '@/util'

/**
 * Add property to express response object
 * by extending Response interface.
 * 
 * This is an example of declaration merging.
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-serve-static-core/index.d.ts#L15-L23
 */
declare global {
  export namespace Express {
    export interface Response {
      data: (data: JSON, filter?: string[]) => void,
      error: (code: CustomError | Error, status = 500) => void,
    }
  }
}

/**
 * Request handler definition
 */
export interface RequestHandler {
  (req: Request, res: Response): Promise<unknown>
}

/**
 * Definition for JSON objects
 */
export interface JSON {
  [key: string]: unknown
}
