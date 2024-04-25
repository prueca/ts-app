import { Request, Response, NextFunction } from 'express'
import { Obj, RequestHandler } from './types'
import Err from './error'
import * as db from './db'
import _ from 'lodash'

export default class Context {
  static _bindings = new WeakMap<Request, Context>()

  private _req: Request
  private _res: Response

  public params: Obj = {}
  public headers: Obj = {}
  public locals: Obj = {}
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
    const wrapper = async (req: Request, res: Response, next: NextFunction) => {
      const ctx = Context.get(req)

      try {
        await method(ctx)

        if (!res.headersSent) {
          next()
        }
      } catch (error) {
        ctx.error(error as Err)
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

    ctx.headers = req.headers

    return ctx
  }

  data(data: Obj, filter?: string[]) {
    if (filter) {
      return this._res.json({
        data: _.pick(data, filter),
      })
    }

    return this._res.json({ data })
  }

  setHeaders(headers: Obj) {
    this._res.set(headers)
  }

  removeHeaders(headers: string[]) {
    _.map(headers, (x) => this._res.removeHeader(x))
  }

  redirect(uri: string) {
    this._res.redirect(uri)
  }

  error(error: Err | Error) {
    const code = _.get(error, 'code', 'unknown_error')
    const message = _.get(error, 'message', '')

    return this._res.json({
      error: {
        code: code,
        message: message,
      },
    })
  }

  request() {
    return this._req
  }

  response() {
    return this._res
  }

  throw(errorCode: string, message?: string) {
    throw new Err(errorCode, message)
  }
}
