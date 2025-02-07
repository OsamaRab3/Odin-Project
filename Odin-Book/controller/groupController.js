
const prisma = require("../utils/prisma");
const io = require('../index')

// create group 
// groupNamae 
const createGroup = async (req, res) => {
    const { name, userId } = req.body;
    try {
        if (!name || !userId) {
            return res.status(400).json({
                status: "fail",
                message: "name and userId is required"
            })
        }
        // check if user already in db or not 
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        })
        if (!user) {
            return res.status(404).json({
                status: "fail",
                message: "USer Not found"
            })
        }

        const NewGroup = await prisma.group.create({
            data: {
                name,
                adminId: parseInt(userId),
                users: {
                    connect: [{ id: parseInt(userId) }],

                },
                countOfMemeber: 1
            }
        })
        io.to(`group`).emit("group", {
            name: NewGroup.name,
            avatar: NewGroup.avatar,
            id: NewGroup.id
        })

        res.status(201).json({
            status: "success",
            data: {
                group: NewGroup,
            },
        });
    }
    catch (error) {
        console.log("error from creating group", error)
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}


const createPost = async (req, res) => {

    // groupId ,authorId ,content 
    const { groupId, authorId, content } = req.body;

    try {


        if (!groupId || !authorId || !content) {
            return res.status(400).json({
                status: "fail",
                message: "missing some data from create post in group"
            })
        }
        // check if group 
        const [group, author] = await Promise.all([
            prisma.group.findUnique({
                where: {
                    id: parseInt(groupId)
                },
                include: {
                    users: { where: { id: parseInt(authorId) }, }
                }
            }),
            prisma.group.findUnique({
                where: { id: parseInt(groupId) },
                select: {
                    users: {
                        where: { id: parseInt(authorId) }
                    }
                }
            })
        ])

        if (!group || !author) {
            return res.status(404).json({
                status: "fail",
                message: "User is not in group or group not found "
            });
        }
        const NewPostInGroup = await prisma.post.create({
            data: {
                groupId: parseInt(groupId),
                authorId: parseInt(authorId),
                content
            }
        })

        io.to(`group_${groupId}`).emit("newPost", NewPostInGroup);

        return res.status(201).json({
            status: "success",
            data: NewPostInGroup
        })

    } catch (error) {
        console.log("error from creaate poste in group")
        return res.status(500).json({
            status: "fail",
            message: error.message
        })
    }
}

const deletePost = async (req, res) => {
    // postId ,groupId ,authorId 
    const { postId, groupId, authorId } = req.params;
    try {
        if (!postId || !groupId || !authorId) {
            return res.status(400).json({
                status: "fail",
                message: "msiing data"
            })
        }

        const [post, group] = await Promise.all([
            prisma.post.findUnique({
                where: {
                    id: parseInt(postId),
                    authorId: parseInt(authorId)
                }
            }),
            prisma.group.findUnique({
                where: {
                    id: parseInt(groupId)
                },
                include: {
                    users: {
                        where: { id: parseInt(authorId) }
                    }
                }
            })
        ])

        if (!post || group) {
            return res.status(404).json({
                status: "fail",
                message: "Group or post  Not found"
            })
        }

        await prisma.post.delete({
            where: {
                id: parseInt(postId)
            }
        })
        io.to(`group_${groupId}`).emit("deletepostfromGroup", { postId });


        return res.status(200).json({
            status: "success",
            message: "post delete from group "
        })


    } catch (error) {
        console.log("error from delete post in group", error)
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }



}



const getUsers = async (req, res) => {
    // groupId 
    const { groupId } = req.params;
    try {
        if (!groupId) {
            return res.status(400).json({
                status: "fail",
                message: "mising groupId "
            })
        }

        const checkIfGroup = await prisma.group.findUnique({
            where: {
                id: parseInt(groupId)
            },
            select: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        profilePicture: true,
                        bio: true,
                    }
                }
            }
        })


        if (!checkIfGroup) {
            return res.status(404).json({
                status: "fail",
                message: "Group Not found"
            })
        }

        return res.status(200).json({
            status: "success",
            message: checkIfGroup.users
        })



    } catch (error) {
        console.log("error from getUser in group", error)
        return res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

const addMember = async (req, res) => {
    // memberId 
    const { userId, groupId } = req.params;
    try {
        if (!userId || !groupId) {
            return res.status(400).json({
                status: "fail",
                message: "fail userId and groupId required "
            })
        }

        const checkIfGroup = await prisma.group.findUnique({
            where: {
                id: parseInt(groupId)
            },
        })
        if (!checkIfGroup) {
            return res.status(404).json({
                status: "fail",
                message: "Group Not found"
            })
        }

        const isMember = await prisma.user.findFirst({
            where: {
                id: parseInt(userId),
                groups: {
                    some: {
                        id: parseInt(groupId)
                    }
                }
            }
        })
        if (isMember) {
            return res.status(409).json({
                status: "fail",
                message: "User is already a member of the group"
            });
        }
        await prisma.group.update({
            where: {
                id: parseInt(groupId)
            },
            data: {
                users: {
                    connect: { id: parseInt(userId) }
                }
            }
        });

        io.to(`group_${groupId}`).emit("addMember", { userId, message: "User added to the group successfully" });


        return res.status(200).json({
            status: "success",
            message: "User added to the group successfully"
        });

    }
    catch (error) {
        console.error("Error from addMember:", error);
        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

const getAllGroups = async (req, res) => {
    try {
        const groups = await prisma.group.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                avatar: true,
                users: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        });

        return res.status(200).json({
            status: "success",
            data: groups
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: "error",
            message: error.message
        })


    }
}


module.exports = {
    createGroup,
    createPost,
    deletePost,
    getUsers,
    addMember,
    getAllGroups
}