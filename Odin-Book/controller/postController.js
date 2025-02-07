// create post 
// delete post 
// get all posts  for user 
// i need to handel error in correct way it not correct if i send error.message to clinet -:)


const  prisma = require('../utils/prisma')
const io = require('../index')
const createPost = async(req,res)=>{
    const {content,authorId} = req.body;
 
    try{
        if(!content||!authorId){
            return res.status(400).json({
                status:"fail",
                message:"massing  some data"
            })
        }
    
        // check user 
        const user = await prisma.user.findUnique({
            where:{id:parseInt(authorId)}
        })
        if(!user){
            return res.status(404).json({
                status:"fail",
                message:"USer Not Found"
            })
        }

        const NewPost = await  prisma.post.create({
            data:{
                content,
                authorId:parseInt(authorId)
            },
            include:{
                author:{
                    select:{
                        name:true
                    }
                }
            }
        })

        // socket 
        io.to(`authorId${authorId}`).emit("createPost", {

            postId: NewPost.id,
            content: NewPost.content,
            author: NewPost.author.name
        });


        return res.status(201).json({
            status:"success",
            data:NewPost
        })


    }catch(error){
        console.error("Error creating post:", error.message);
        if(error instanceof TypeError){
            console.log(`author id must be int but found ${authorId}`)
            console.log("error stack",error.stack)
      
        }
        return res.status(500).json({
            status:"error",
            message:error.message
        })
    }
}



const deletePost = async(req,res)=>{
    // postId
    // need to modifiy who can deletePost? 
    const {postId, authorId} = req.params;
    try{
        if(!postId||!authorId){
            return res.status(400).json({
                status:"fail",
                message:"massing some data"
            })
        }
        const [post,author] = await Promise.all([
            prisma.post.findUnique({where:{ 
                id:parseInt(postId),
                authorId:parseInt(authorId)
            }
        }),
            prisma.user.findUnique({where:{id:parseInt(authorId)}})
        ])

        if(!post || !author){
            return res.status(404).json({
                status:"fail",
                message:"Post or author not found"
            })
        }
        if (post.authorId !== parseInt(authorId)){
            return res.status(401).json({
                status:"fail",
                message:"Unauthorized to delete post"
            })
        }

        await prisma.post.delete({
            where:{
                id:parseInt(postId)
            }
        })

        io.to(`postId${postId}`).emit("deletepost", { postId });
        
        res.status(200).json({
            status:"success",
            message:"post deleted success"
        })
    }catch(error){
        console.log("Error catch from delet post ",error.message)

        return res.status(500).json({
            status:"error",
            message:error.message
        })
    }
}

//  Oops must  use pagination
const getPosts = async (req, res) => {

    try {
        let { page, limit } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 7;
        const skip = (page - 1) * limit;
        const posts = await prisma.post.findMany({
            orderBy: {
                createdAt: 'desc' 
            },
            skip: skip,
            take: limit,
            select: {
                id:true,
                content: true,
                createdAt: true,
                comments: {
                    select: {
                        id:true,
                        content: true,
                        likesCount:true,
                        author: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                author: {
                    select: {
                       name:true
                    }
                },
                likes:{
                    select:{
                        userId:true
                    }
                }
            },
            
        });

        return res.status(200).json({
            status: "success",
            data: posts
        });

    } catch (error) {
        console.error("Error fetching posts:", error);

        return res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};


const sharePost = async(req,res) =>{
    const {userId,postId,content} = req.body;
    try{
        if(!userId||postId){
            return res.status(400).json({
                status:"fail",
                message:"missing some data"
            })
        }

        const [user,originalPost] = await Promise.all ([
            prisma.post.findUnique({
                where:{id:parseInt(postId)},
                select:{ author:{
                            select:{
                                id:true,
                                name:true
                            }}}}),
            prisma.user.findUnique({where:{id:parseInt(userId)}})
        ])

        if(!originalPost ||!user){
            return res.status(404).json({ 
                status:"fail",
                message: "post or User not found." 
            });
        }

        const NewPost = await prisma.post.create({
            data:{
                authorId:parseInt(userId),
                sharedPostId:parseInt(postId),
                content:content || null,
            },
            include:{
                author:{
                    select:{
                        id:true,
                        name:true
                    }
                }
            }
        })

        io.to(`sharedPst${postId}`).emit('sharePost',{
            postId: NewPost.id,
            content: NewPost.content,
            author: NewPost.author.name,
            authorId:NewPost.author.id
        })

        
        return res.status(201).json({
            status:"success",
            data:NewPost
        })

    }catch(error){
        console.log("error from share post", error)
        return res.status(500).json({
            status:"error",
            message:error.message
        })
    }
}

const updatePost = async(req,res)=>{
    // postId ,UserId ,content 
    const {postId,userId,content} = req.body;

    try{
        if(!postId || !userId ||! content){
            return res.status(400).json({
                status:"fail",
                message:"massing  some data"
            })
        }

        const [post,user] = await Promise.all([
            prisma.post.findUnique({
                where:{ id:parseInt(postId)} ,
                 select: {authorId: true,  }}),
            prisma.user.findUnique({where:{id:parseInt(userId)}})
        ])

        if(!post||!user){
            return res.status(404).json({
                status:"fail",
                message:"Post or user  Not found"
            })
        }

        if (post.authorId !== parseInt(userId)) {
            return res.status(401).json({
                status: "fail",
                message: "You are not authorized to update this post"
            });
        }

     
       const updatePost =  await prisma.post.update({
            where: { id: parseInt(postId) },
            data: { content }
        });

        io.to(`updatePost${postId}`).emit("updatePost",{
            content:updatePost.content,
            authorId: updatePost.authorId

        })

        return res.status(200).json({
            status:"success",
            message:"post Update success",
            data:updatePost
        })

    }catch(error){
        console.log("error from update post",error)
        return res.status(500).json({
            status:"error",
            message:error.message
        })
    }

}
//   ------------------------------- moved to User Controller ---------------------------------------



module.exports = {
    createPost,
    deletePost,
    getPosts,
    sharePost,
    updatePost

}