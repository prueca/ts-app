import { Request, Response } from 'express'
import { KeyVal } from '@/type-def'
import CustomError from '@/util/custom-error'
import * as db from '@/util/db'
import _ from 'lodash'

export default class Context {
  static _bindings = new WeakMap<Request, Context>()
  private req: Request
  private res: Response
  public params: KeyVal = {}
  public db = db

  constructor(req: Request, res: Response) {
    this.req = req
    this.res = res
  }

  static bind(req: Request, res: Response) {
    const ctx = new Context(req, res)

    _.assign(
      ctx.params,
      _.mapKeys(req.body, (_v, k) => k),
      _.mapKeys(req.params, (_v, k) => k),
      _.mapKeys(req.query, (_v, k) => k),
    )

    Context._bindings.set(req, ctx)
  }

  static get(req: Request): Context {
    return Context._bindings.get(req) as Context
  }

  data(data: KeyVal, filter?: string[]) {
    if (filter) {
      return this.res.json({
        data: _.pick(data, filter)
      })
    }

    return this.res.json({ data })
  }

  error(error: CustomError | Error) {
    const status = _.get(error, 'status', 500)
    const code = _.get(error, 'code', 'unknown_error')
    const message = _.get(error, 'message', '')

    return this.res.status(status)
      .json({
        error: {
          code: code,
          message: message
        }
      })
  }

  request() {
    return this.req
  }

  response() {
    return this.res
  }

  throw(errorCode: string, message?: string) {
    throw new CustomError(errorCode, message)
  }
}