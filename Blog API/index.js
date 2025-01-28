const express = require('express')
const cors = require('cors')
const path = require('path');
const prisma = require('./utils/prisma');
const app = express()
const PORT = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname,"public")))


app.use((req, res, next) => {
    console.log(`${req.method}  -${req.url}`);
    next();
});

const morgan = require('morgan');
app.use(morgan('dev')); 
// -----------------------------------------------------------------

const userRoues = require('./routes/auth.route')
const commentRoutes = require('./routes/comment.route')

app.use('/api/user',userRoues)

app.use('/api',commentRoutes)







// -----------------------------------------------------------------

app.post('/createArticle', async (req, res) => {
    try {
        const { title, content, authorId } = req.body;

        if (!title || !content || !authorId) {
            return res.status(400).json({
                status: "fail",
                message: "Title, content, and author ID are required"
            });
        }

        const newArticle = await prisma.article.create({
            data: {
                title,
                content,
                author: { connect: { id: parseInt(authorId) } }
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.status(201).json({
            status: "success",
            data: newArticle
        });

    } catch (error) {
        console.error("Error creating article:", error);

        const errorResponse = {
            status: "error",
            message: "Internal server error"
        };

        if (error.code === 'P2002') {
            errorResponse.message = "Article with this title already exists";
            res.status(409).json(errorResponse);
        } else {
            res.status(500).json(errorResponse);
        }
    }
});


// -----------------------------------------------------------------



app.listen(PORT,()=>{
    console.log(`run in ${PORT}`)
})