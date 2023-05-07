import { Request, Response, NextFunction } from 'express'
import { Dictionary, RequestHandler } from './types'
import CustomError from './custom-error'
import * as db from './db'
import _ from 'lodash'

export default class Context {
  static _bindings = new WeakMap<Request, Context>()

  private _req: Request
  private _res: Response

  public params: Dictionary = {}
  public db = db

  constructor(req: Request, res: Response) {
    this._req = req
    this._res = res
  }

  static attach() {
    return (req: Request, res: Response, next: NextFunction) => {
      const ctx = new Context(req, res)
      Context._bindings.set(req, ctx)

      next()
    }
  }

  static handle(method: RequestHandler) {
    const wrapper = async (req: Request) => {
      const ctx = Context.get(req)

      try {
        await method(ctx)
      } catch (error) {
        ctx.error(error as CustomError)
      }
    }

    return wrapper
  }

  static get(req: Request): Context {
    const ctx = Context._bindings.get(req) as Context

    _.assign(
      ctx.params,
      _.mapKeys(req.query, (_v, k) => k),
      _.mapKeys(req.params, (_v, k) => k),
      _.mapKeys(req.body, (_v, k) => k),
    )

    return ctx
  }

  data(data: Dictionary, filter?: string[]) {
    if (filter) {
      return this._res.json({
        data: _.pick(data, filter)
      })
    }

    return this._res.json({ data })
  }

  error(error: CustomError | Error) {
    const status = _.get(error, 'status', 500)
    const code = _.get(error, 'code', 'unknown_error')
    const message = _.get(error, 'message', '')

    return this._res.status(status)
      .json({
        error: {
          code: code,
          message: message
        }
      })
  }

  request() {
    return this._req
  }

  response() {
    return this._res
  }

  throw(errorCode: string, message?: string) {
    throw new CustomError(errorCode, message)
  }
}