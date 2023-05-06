import Context from '@/util/context'

/**
 * Request handler definition
 */
export interface RequestHandler {
  (ctx: Context): Promise<unknown>
}

/**
 * Definition for JSON objects
 */
export interface KeyVal {
  [key: string]: any
}
