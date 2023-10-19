import { rateLimit, RateLimitRequestHandler } from "express-rate-limit"

const rate_limiter: RateLimitRequestHandler = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 50,
    message: "Too many request in one minute, we allow only 50 per minute."
});

export default rate_limiter;