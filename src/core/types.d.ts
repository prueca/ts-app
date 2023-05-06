import Context from './context'

/**
 * Request handler definition
 */
export interface RequestHandler {
  (ctx: Context): Promise<unknown>
}

/**
 * Definition for JSON objects
 */
export interface Dictionary {
  [key: string]: any
}
