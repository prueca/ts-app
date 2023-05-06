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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
