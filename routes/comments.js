const express = require('express');
const router = express.Router();
const Posts = require('../schemas/post');
const Comments = require('../schemas/comment');


router.get('/comments/:postId', async (req, res) => {
    const selectedPostId = req.params.postId;
    const posts = await Posts.find({ postId: selectedPostId });
    const comments = await Comments.find({}, { postId: 1, user: 1, content: 1, createdAt: 1 }).sort({ createdAt: -1 });

    const data = posts.map(post => {
        return {
            comments: comments.filter(comment => comment.postId === post.postId)
        }
    });
    res.json({ data });
});

router.get('/comments', async (req, res) => {
    const comments = await Comments.find({}, { postId: 1, user: 1, content: 1, createdAt: 1 }).sort({ createdAt: -1 })

    res.json({ data: comments })
})

router.post('/comments/:postId', async (req, res) => {
    const { postId } = req.params;
    const { commentId, user, content } = req.body;
    const comments = await Comments.find({ commentId });
    if (comments.length) {
        return res.status(400).json({
            success: false,
            Error: "Comment ID must be unique!"
        });
    } else {
        if (!content) {
            return res.status(204).json({
                errorMessage: "Please enter the comment content"
            })
        }
        const createdComment = await Comments.create({
            postId: postId,
            commentId: commentId,
            user: user,
            content: content,
        });

        res.status(201).json({ comments: createdComment });
    }
});

router.put('/comments/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const comment = await Comments.findOne({ commentId: commentId })

    if (!content) {
        return res.status(304).json({
            errorMessage: "Please enter the comment content"
        })
    }
    if (comment) {
        await Comments.updateOne({ commentId: commentId },
            {
                $set: {
                    content: content
                }
            })
        return res.status(200).json({
            message: 'The comment has been edited',
            success: true,
        })
    }
})

router.delete('/comments/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comments.findOne({ commentId: commentId })

    if (comment) {
        await Comments.deleteOne({ commentId: commentId })
        res.status(200).json({
            message: 'The post has been deleted',
            success: true,
        })
    } else {
        res.status(404).json({
            errorMessage: "Data not found"
        })
    }
})

module.exports = router;