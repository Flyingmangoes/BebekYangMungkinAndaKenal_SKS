import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit'

export const RLFactory = (window_minute:number, limit: number) => ({ 
    authRateLimit():RateLimitRequestHandler {
        return rateLimit({
            windowMs: window_minute * 60 * 1000,
            limit: limit
        })
    },
    mainRateLimit():RateLimitRequestHandler {
        return rateLimit({
            windowMs: window_minute * 60 * 1000,
            limit: limit
        })
    }
})

