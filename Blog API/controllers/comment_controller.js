// create comment 
// add love 
// get all love 
// get all comment 

// handel model in db 



// create new prsm clint 
const { validationResult } = require('express-validator')

const prisma  = require('../utils/prisma')


const getComments = async (req, res) => {
    const { articleId } = req.params; 
    try {


        if (!articleId) {
            return res.status(400).json({
                status: "fail",
                message: "Article ID is required"
            });
        }

        const articleWithComments = await prisma.article.findUnique({
            where: {
                id: parseInt(articleId)
            },
            include: {
                comments: {
                    include: {
                        user: {
                            select: {
                                // id: true,
                                name: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc' 
                    }
                }
            }
        });

        if (!articleWithComments) {
            return res.status(404).json({
                status: "fail",
                message: "Article not found",
                data:null
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                comments: articleWithComments.comments
            }
        });

    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({
            status: "error",
            message:error.message
        });
    }
};
const createComment = async (req, res) => {

    const { message, userId, articleId } = req.body;


    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: "fail",
                message: "Validation errors",
                errors: errors.array()
            });
        }


        if (!message || !userId || !articleId) {
            return res.status(400).json({
                status: "fail",
                message: "Comment message, userId, and articleId are required"
            });
        }
        const comment = await prisma.comment.create({
            data: {
                message: message,
                user: { connect: { id: parseInt(userId) } },
                article: { connect: { id: parseInt(articleId) } }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        
                    }
                },
                article: {
                    select: {
                        id: true,
                    }
                }
            }
        });

        res.status(201).json({
            status: "success",
            data: comment
        });

    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
};
// const getAllLikes = async(req,res)=>{
//     try{
//     const {articleId} = req.params;
//     if(!articleId){
//         return res.status(400).json({
//             status: "fail",
//             message: "Article ID are required"
//         });
//     }

//     const article = await prisma.article.findUnique({
//         where:{
//             id:parseInt(articleId)
//         },
//         select:{
//             likesCount: true 
//         }
//     });
//     res.status(200).json({
//         status:"success",
//         data:article.likesCount

//     })
// }catch(error){
//     console.error("Error getALL likes:", error);
//     res.status(500).json({
//       status: "error",
//       message:error.message
//     });
// }
    



// }

// const toggleLike = async (req, res) => {
//     const { articleId, userId } = req.body;
//     try {
//       if (!articleId || !userId) {
//         return res.status(400).json({
//           status: "fail",
//           message: "Article ID and User ID are required"
//         });
//       }


//       let updatedArticle;
//           await prisma.article.update({
//             where: { 
//                 id: parseInt(articleId),
//                 user: { connect: { id: parseInt(userId) } }
//              },
//             data: { likesCount: { increment: 1 } }
//           })

  
//         updatedArticle = await prisma.article.findUnique({
//           where: { id: parseInt(articleId) },
//           select: { likesCount: true }
//         });
      
  
//       res.status(200).json({
//         status: "success",
//         data: {
//           likesCount: updatedArticle.likesCount,
//         }
//       });
  
//     } catch (error) {
//       console.error("Error toggling like:", error);
//       res.status(500).json({
//         status: "error",
//         message: error.message
//       });
//     }
//   };



module.exports = {
    createComment,
    getComments,
    // toggleLike,
    // getAllLikes
}