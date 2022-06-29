const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

// @route POST api/posts
// @desc Create a post
// @access Private
router.post('/', [auth, check('text', 'Text is required').not().isEmpty()], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try{
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route GET api/possts
// @desc Get all posts
// @access Public
router.get('/', async (req, res) => {
    try{
        const post = await Post.find().sort({date: -1});
        res.json(post);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route GET api/posts/:id
// @desc Get post by id
// @access Private
router.get('/:id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        
        if (!post) return res.status(400).json({msg: 'Post no found'});
        res.json(post);
    }catch(err){
        console.error(err.message);

        if(err.kind == 'ObjectId'){
            return res.status(404).json({msg: 'Post no found'});
        }
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/posts/:id
// @desc DELETE post by id
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg: 'Post no found'});
        }

        // Check User
        if(post.user.toString() != req.user.id){
            return res.status(401).json({msg: 'User not authorized'});
        }
        await post.remove();
        res.json({msg: 'Post removed'});
    }catch(err){
        console.error(err.message);

        if(err.kind == 'ObjectId'){
            return res.status(404).json({msg: 'Post no found'});
        }
        res.status(500).send('Server Error');
    }
});

// @route PUT api/posts/like/:id
// @desc Like a post
// @access Private
router.put('/like/:id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg: 'Post no found'});
        }

        // Check if the post has been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg: 'Post alrealy liked'});
        }

        post.likes.unshift({user: req.user.id});
        await post.save();
        res.json(post.likes);
       
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route PUT api/posts/unlike/:id
// @desc Unlike a post
// @access Private
router.put('/unlike/:id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg: 'Post no found'});
        }

        // Check if the post has been liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({msg: 'Post has not been liked'});
        }

        // Get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);

        await post.save();
        res.json(post.likes);
       
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route POST api/posts/comments/:id
// @desc Create a post
// @access Private
router.post('/comment/:id', [auth, check('text', 'Text is required').not().isEmpty()], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    try{
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment= new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/posts/comment/:id/:comment_id
// @desc DELETE comment
// @access Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg: 'Post no found'});
        }

        // Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        //Make user comment exists
        if(!comment){
            return res.status(404).json({msg: 'Comment no found'});
        }
        //Check user
        if (comment.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User not authorized'});
        }

        // Get remove index
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);

        await post.save();
        res.json(post.comments);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;