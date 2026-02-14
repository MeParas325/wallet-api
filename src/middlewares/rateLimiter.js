import rateLimit from "../config/upStash.js";

const rateLimiter = async (req, res, next) => {

    try {
        
        const {success} = await rateLimit.limit("my-rate-limit");

        if(!success) {
            res.status(429).json({
                success: false,
                message: "To many request. Please try again later!"
            })
        }
        next();
    } catch (error) {
        console.log("Rate limit error: ", error);
        next(error);
    }
}

export default rateLimiter;