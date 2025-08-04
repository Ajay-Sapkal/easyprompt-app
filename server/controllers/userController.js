// Import the database connection
import sql from "../configs/db.js";


// This function gets all creations (articles, images, etc.) made by the logged-in user, sorted by newest first.
export const getUserCreations = async (req, res) => {
    try {
        const {userId} = req.auth(); // Get the user's ID from authentication

        // Query the database for all creations by this user, newest first
        const creations = await sql`
            SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`

        // Send the creations back to the client
        res.json({
            success: true,
            creations
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

// This function gets all published creations (visible to everyone), sorted by newest first.
export const getPublishedCreations = async (req, res) => {
    try {

        // Query the database for all published creations, newest first
        const creations = await sql`
            SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`

        // Send the published creations back to the client
        res.json({
            success: true,
            creations
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}

// This function lets a user like or unlike a creation (article, image, etc.).
// If the user has already liked it, their like is removed (unlike). Otherwise, their like is added.
export const toggleLikeCreation = async (req, res) => {
    try {

        const {userId} = req.auth(); // Get the user's ID from authentication
        const {id} = req.body;     // Get the creation ID from the request body

        // Query the database for the creation with the given ID
        const [creation] = await sql`
            SELECT * FROM creations WHERE id = ${id}`

        // If the creation does not exist, return an error
        if (!creation) {
            return res.json({
                success: false,
                message: "Creation not found"
            });
        }

        const currentLikes = creation.likes; // Array of user IDs who liked this creation
        const userIdStr = userId.toString(); // Convert userId to string for comparison
        let updatedLikes;
        let message;

        // If the user already liked this creation, remove their like (unlike)
        if( currentLikes.includes(userIdStr) ) {
            updatedLikes = currentLikes.filter((user)=> user !== userIdStr);
            message = "Creation unliked";
        } else {
            // Otherwise, add their like
            updatedLikes = [...currentLikes, userIdStr];
            message = "Creation liked";
        }
        // Format the array for PostgreSQL text[]
        const formattedArray = `{${updatedLikes.join(', ')}}`;

        // Update the likes in the database
        await sql`
            UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}
        `;

        // Send the result back to the client
        res.json({
            success: true,
            message
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}