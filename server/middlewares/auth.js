import { clerkClient } from "@clerk/express";

// This middleware checks if the user is authenticated and if they have a premium plan.
// It also manages the user's free usage count for non-premium users.
export const auth = async (req, res, next) => {
    try {
        // Get userId and the 'has' function from Clerk's authentication object
        const {userId, has} = await req.auth();
        // Check if the user has a premium plan
        const hasPremiumPlan = await has({plan: 'premium'});

        // Get the user's data from Clerk
        const user = await clerkClient.users.getUser(userId);

        // If the user is not premium and has a free usage count, use it
        if (!hasPremiumPlan && user.privateMetadata.free_usage) {
            req.free_usage = user.privateMetadata.free_usage;
        } else {
            // If the user is premium or doesn't have a usage count, reset it to 0
            await clerkClient.users.updateUser(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            });
            req.free_usage = 0;
        }
        // Set the user's plan type for use in other parts of the app
        req.plan = hasPremiumPlan ? 'premium' : 'free';
        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        // If there's an error, send a failure response
        res.json({
            success: false,
            message: error.message
        });
    }
}