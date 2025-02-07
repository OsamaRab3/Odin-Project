const prisma = require('./prisma')
const addLike = async(req,res)=>{
    // postId ,userId 
    const {userId,itemId,type} = req.params;
    try{
        if(!userId||!itemId||!type){
            return res.status(400).json({
                status:"fail",
                message:"massing  some data"
            })
        }

        let like;

        if (type === 'post') {
            like = await prisma.like.create({
                data: {
                    user: { connect: { id: parseInt(userId) } },
                    post: { connect: { id: parseInt(itemId) } }
                }});

            updatedEntity = await prisma.post.update({
                where: { id: parseInt(itemId) },
                data: { likesCount: { increment: 1 } }
            });
        }
        else if (type === 'comment') {
            like = await prisma.like.create({
                data: {
                    user: { connect: { id: parseInt(userId) } },
                    comment: { connect: { id: parseInt(itemId) } }
                }});

            updatedEntity = await prisma.comment.update({
                where: { id: parseInt(itemId) },
                data: { likesCount: { increment: 1 } }
            });
        } else {
            return res.status(400).json({
                status: "fail",
                message: "Invalid type, must be 'post' or 'comment'"
            });
        }



        return res.status(200).json({
            status: "success",
            message: "Like added successfully",
            data: like
        });


    }catch(error){
        console.log("error from add like ",error)
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

const removeLike = async (req, res) => {
    const { userId, itemId, type } = req.params;

    try {
        if (!userId || !itemId || !type) {
            return res.status(400).json({
                status: "fail",
                message: "Missing some required data"
            });
        }

        let like;
        let updatedEntity;

        // Determine whether it's a post or comment and remove like accordingly
        if (type === 'post') {
            like = await prisma.like.findFirst({
                where: {
                    userId: parseInt(userId),
                    postId: parseInt(itemId)
                }
            });

            if (!like) {
                return res.status(404).json({
                    status: "fail",
                    message: "Like not found"
                });
            }

            // Remove the like
            await prisma.like.delete({
                where: { id: like.id }
            });

            // Decrement likes count on the post
            updatedEntity = await prisma.post.update({
                where: { id: parseInt(itemId) },
                data: { likesCount: { decrement: 1 } }
            });
        } else if (type === 'comment') {
            like = await prisma.like.findFirst({
                where: {
                    userId: parseInt(userId),
                    commentId: parseInt(itemId)
                }
            });

            if (!like) {
                return res.status(404).json({
                    status: "fail",
                    message: "Like not found"
                });
            }

            // Remove the like
            await prisma.like.delete({
                where: { id: like.id }
            });

            // Decrement likes count on the comment
            updatedEntity = await prisma.comment.update({
                where: { id: parseInt(itemId) },
                data: { likesCount: { decrement: 1 } }
            });
        } else {
            return res.status(400).json({
                status: "fail",
                message: "Invalid type, must be 'post' or 'comment'"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Like removed successfully",
            data: like
        });
    } catch (error) {
        console.log("Error from removing like:", error);
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};


module.exports = {
    addLike,
    removeLike
}

