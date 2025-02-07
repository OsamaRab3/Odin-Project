// const { connect } = require("../routes/user.route");
const prisma = require("../utils/prisma");

const getUserInfo = async (req, res) => {
    const { userId } = req.params;

    try {

        if (!userId) {
            return res.status(400).json({
                status: "fail",
                message: "Invalid or missing User ID"
            });
        }

        const userData = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
            select: {
                id: true,
                name: true,
                profilePicture: true,
                countOfFollowers: true,
                countOfFollowing: true,
                bio: true,
                posts: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        likesCount: true,
                        comments: {
                            select: {
                                id: true,
                                content: true,
                                createdAt: true,
                                author: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                followers: {
                    select: {
                        follower: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                following: {
                    select: {
                        following: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        if (!userData) {
            return res.status(404).json({
                status: "fail",
                message: "User not found"
            });
        }


        res.status(200).json({
            status: "success",
            data: userData
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({
            status: "error",
            message: error.message,

        });
    }
};

const createComment = async (req, res) => {
    // content ,userId 
    const { content, userId, postId } = req.body;
    try {
        if (!content || !userId || !postId) {
            return res.status(400).json({
                status: "fail",
                message: "Massing some data "
            })
        }
        // check  PostId ,userId 
        // -----  after Reading Ch 9 Cook Book => now i will replace this all code using promise.all   it's really good 
        const [post, user] = await Promise.all([
            prisma.post.findUnique({ where: { id: parseInt(postId) } }),
            prisma.user.findUnique({ where: { id: parseInt(userId) } })
        ]);

        if (!post || !user) {
            return res.status(404).json({
                status: "fail",
                message: "User or post not found"
            });
        }


        const newComment = await prisma.comment.create({
            data: {
                content,
                authorId: parseInt(userId),
                postId: parseInt(postId)
            },
            select: {
                content: true,
                createdAt: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })
        io.to(`postId${postId}`).emit('newComment', {
            postId: postId,
            comment: newComment,
            author: newComment.author.name
        });


        return res.status(201).json({
            status: "success",
            data: newComment
        })

    } catch (error) {
        console.log("Error from creating comment ", error)
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

const deleteComment = async (req, res) => {
    const { commentId, userId } = req.params;

    try {

        if (!commentId || !userId) {
            return res.status(400).json({
                status: "fail",
                message: "Both comment ID and user ID are required"
            });
        }


        const [user,comment] =  await Promise.all([
             prisma.user.findUnique({where: { id: parseInt(userId) }}),
             prisma.comment.findFirst({where: {id: parseInt(commentId),authorId: parseInt(userId)}})
        
        ])

        if (!user||!comment){
            return res.status(404).json({
                status:"fail",
                message:"User or Comment Not Found"
            })
        }

        // const user = await prisma.user.findUnique({
        //     where: { id: parseInt(userId) }
        // });

        // if (!user) {
        //     return res.status(404).json({
        //         status: "fail",
        //         message: "User not found"
        //     });
        // }


        // const comment = await prisma.comment.findFirst({
        //     where: {
        //         id: parseInt(commentId),
        //         authorId: parseInt(userId)
        //     }
        // });

        // if (!comment) {
        //     return res.status(404).json({
        //         status: "fail",
        //         message: "Comment not found or you don't have permission to delete it"
        //     });
        // }

        await prisma.comment.delete({
            where: {
                id: parseInt(commentId)
            }
        });

        io.to(`commentId${commentId}`).emit("deleteComment",{commentId})

        res.status(200).json({
            status: "success",
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.error("Delete comment error:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
};
const followToggle = async (req, res) => {
    const { followerId, followingId } = req.params;

    try {
        if (!followerId || !followingId) {
            return res.status(400).json({
                status: "error",
                message: "Both followerId and followingId are required"
            });
        }

        const [followerUser, followingUser] = await Promise.all([
            prisma.user.findUnique({ where: { id: parseInt(followerId) } }),
            prisma.user.findUnique({ where: { id: parseInt(followingId) } })
        ]);

        if (!followerUser || !followingUser) {
            return res.status(404).json({
                status: "error",
                message: "One or both users not found"
            });
        }


        const existingFollow = await prisma.follow.findFirst({
            where: {
                followerId: parseInt(followerId),
                followingId: parseInt(followingId)
            }
        });

        if (existingFollow) {

            await prisma.follow.delete({
                where: { id: existingFollow.id }
            });

            await Promise.all([
                prisma.user.update({
                    where: { id: parseInt(followingId) },
                    data: { countOfFollowers: { decrement: 1 } }
                }),
                prisma.user.update({
                    where: { id: parseInt(followerId) },
                    data: { countOfFollowing: { decrement: 1 } }
                })
            ]);

            io.to(`follow${followerId}`).emit('togglefollow', { followerId, message: "User unfollowed successfully"});


            return res.status(200).json({
                status: "success",
                message: "User unfollowed successfully"
            });
        } else {

            const newFollow = await prisma.follow.create({
                data: {
                    followerId: parseInt(followerId),
                    followingId: parseInt(followingId)
                }
            });

            await Promise.all([
                prisma.user.update({
                    where: { id: parseInt(followingId) },
                    data: { countOfFollowers: { increment: 1 } }
                }),
                prisma.user.update({
                    where: { id: parseInt(followerId) },
                    data: { countOfFollowing: { increment: 1 } }
                })
            ]);

            io.to(`follow${followerId}`).emit('togglefollow', {
                followerId,
                message: "User ollowed successfully"
            });
            
            return res.status(201).json({
                status: "success",
                message: "User followed successfully",
                data: newFollow
            });
        }

    } catch (error) {
        console.error("Follow/Unfollow error:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
};


const getAllUser = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                name: true,
                id: true,
                profilePicture: true
            }
        })

        return res.status(200).json({
            status: "success",
            data: users
        })

    } catch (error) {
        console.log("error fetchin all user from controler ", error)
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}


module.exports = {
    getUserInfo,
    createComment,
    getAllUser,
    followToggle,
    deleteComment
}