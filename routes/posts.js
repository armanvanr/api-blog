const express = require('express');
const router = express.Router();
const Posts = require('../schemas/post');

router.get('/posts', async (req, res) => {
    const posts = await Posts.find({}, { postId: 1, title: 1, user: 1, createdAt: 1, _id: 0 }).sort({ createdAt: -1 })
    const result = posts.map(p => {
        return p
    });

    res.json({ data: result })
});

router.post('/posts', async (req, res) => {
    const { postId, title, user, password, content } = req.body;
    const posts = await Posts.find({ postId });
    if (posts.length > 0) {
        return res.status(400).json({
            success: false,
            errorMessage: "Post ID is already used, please enter another post ID"
        });
    }

    const createdPost = await Posts.create({
        postId: postId,
        title: title,
        user: user,
        password: password,
        content: content,
    });

    res.json({ posts: createdPost });
});

router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params;
    const post = await Posts.find({ postId }, { postId: 1, title: 1, user: 1, createdAt: 1, content: 1, _id: 0 }).sort({ createdAt: -1 });

    if (post.length > 0) {
        return res.json(post[0]);
    } else {
        res.status(400).json({
            success: false,
            errorMessage: "The post is not found"
        });
    }
});

router.get('/post/search/:key', async (req, res) => {
    const filteredPosts = await Posts.find({
        $or: [
            { user: { $regex: req.params.key } },
            { title: { $regex: req.params.key } },
            { content: { $regex: req.params.key } },
        ]
    }, { postId: 1, title: 1, user: 1, createdAt: 1, content: 1, _id: 0 })
    res.json({ data: filteredPosts });
});

router.put('/posts/:postId', async (req, res) => {
    const { postId } = req.params;
    const { title, content, password } = req.body;
    const posts = await Posts.find({ postId: postId });
    if (posts[0].password === password) {
        await Posts.updateOne(
            { postId: postId },
            { $set: { title: title, content: content } });
        res.json({ success: true, message: "The post has been updated" });
    } else {
        res.json({ errorMessage: "The password is incorrect" })
    }
})

router.delete('/posts/:postId', async (req, res) => {
    const { postId } = req.params;
    const { password } = req.body;
    const posts = await Posts.find({ postId: postId });
    if (posts[0].password === password) {
        await Posts.deleteOne({ postId });
        res.json({ success: true, message: "The post has been deleted" });
    } else {
        res.json({ errorMessage: "The password is incorrect" })
    }

})

module.exports = router;