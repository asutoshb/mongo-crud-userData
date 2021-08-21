

//const users = [];
//HTTP verbs
//post => for creating something on the server
//get => for getting something from the server
//put/patch => for updating something on the server
//delete => for deleting something on the server


//localhost:2346
//post /users

//first we need to have express connect to mongodb

//thne we need to create a schema


const express =  require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

const connect = () => {

    return mongoose.connect("mongodb://127.0.0.1:27017/test",{

        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false

    })

}

const userSchema = new mongoose.Schema({
    id: Number,
    firstName: String,
    lastName: String,
    email: String,
    gender: String,
    age: Number
},{
    versionKey: false, 
    timestamps : true
});

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    tagIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "tags",
            required: true,
        }
    ]
},
{
    versionKey: false, 
    timestamps : true
});

//comment schema
const commentSchema = new mongoose.Schema({
    commentBody: {type: String, required: true},
      postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
        required: true,
    },
},
{
    versionKey: false, 
    timestamps : true
});

const tagSchema = new mongoose.Schema({
    tagName: {type: String, required: true}
},
{
    versionKey: false, 
    timestamps : true
});

const User = mongoose.model("users", userSchema);//users collection in mongodb

const Post = mongoose.model("posts", postSchema);//users collection in mongodb

const Comment = mongoose.model("comments", commentSchema);

const Tag = mongoose.model("tags", tagSchema);




//then we will tell mongoose to create that collection 
//inside mongodb with the given schema and
//also create a model that allow us to interact with mongo easily

//run the connect function

app.post("/users",async function (req, res) {

    const user = await User.create(req.body);

    return res.send(user);
})



app.get("/users",async function (req, res) {
    const users = await User.find().lean().exec();      
    return res.send(users);
})

app.get("/users/:id", async function (req, res) {
    const user = await User.findById(req.params.id).lean().exec();
    return res.send(user);
})

app.patch("/users/:id", async function (req, res) {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true}).lean().exec();
    return res.send(user);
})

app.delete("/users/:id", async function (req, res) {
    const user = await User.findByIdAndDelete(req.params.id);
    return res.send(user);
})


// app.get('/users/:id/posts', async function (req, res) {
//     const userPosts = await Post.find({userId: req.params.id}).lean().exec();
//     const user = await User.findById(req.params.id);

//     res.status(200).send({posts:userPosts, user: user});

//    // res.status(200).send(userPosts);
// })

app.get("/users/:id/posts", async function (req, res) {
    const userPosts = await Post.find({ userId: req.params.id }).lean().exec()
    let userPostsWithComments = {};
    userPosts.forEach(async post => {
        const postId = post._id;
        const comment = await getUserPostsWithComments(post);
        userPostsWithComments[postId] = {};
        userPostsWithComments[postId]["post"] = post;
        userPostsWithComments[postId]["comments"] = comment;
    })
    const user = await User.findById(req.params.id)
    return res.status(200).json({ postsWithComments: userPostsWithComments, user: user })
})

async function getUserPostsWithComments(post) {
    const comment = await Comment.find({ postId: post._id }).lean().exec()
    return comment
}

//CRUD operations for posts
app.post("/posts",async function (req, res) {

    try{
            const post = await Post.create(req.body);

             return res.status(201).send(post);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})

app.get("/posts",async function (req, res) {

    try{
            const posts = await Post.find().populate("userId").populate("tagIds").lean().exec();

             return res.status(200).send(posts);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})

app.get("/posts/:id",async function (req, res) {

    try{
            const post = await Post.findById(req.params.id).lean().exec();

             return res.status(200).send(post);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})

app.patch("/posts/:id",async function (req, res) {

    try{
            const post = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true}).lean().exec();

             return res.status(205).send(post);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})

app.delete("/posts/:id",async function (req, res) {

    try{
            const post = await Post.findByIdAndDelete(req.params.id).lean().exec();

             return res.status(200).json({post: post});
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})


//CRUD operations for comments
app.post("/comments",async function (req, res) {

    try{
            const comment = await Comment.create(req.body);

             return res.status(201).send(comment);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})

app.get("/comments",async function (req, res) {

    try{
            const comments = await Comment.find().populate("postId").lean().exec();

             return res.status(200).send(comments);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})

app.get("/comments/:id",async function (req, res) {

    try{
            const comment = await Comment.findById(req.params.id).lean().exec();

             return res.status(200).send(comment);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})

app.patch("/comments/:id",async function (req, res) {

    try{
            const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {new: true}).lean().exec();

             return res.status(205).send(comment);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})

app.delete("/comments/:id",async function (req, res) {

    try{
            const comment = await Comment.findByIdAndDelete(req.params.id).lean().exec();

             return res.status(200).json({comment: comment});
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})



//CRUD operations for tags
app.post("/tags",async function (req, res) {

    try{
            const tag = await Tag.create(req.body);

             return res.status(201).send(tag);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})

app.get("/tags",async function (req, res) {

    try{
            const tags = await Tag.find().lean().exec();

             return res.status(200).send(tags);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})

app.get("/tags/:id",async function (req, res) {

    try{
            const tag = await Tag.findById(req.params.id).lean().exec();

             return res.status(200).send(tag);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})

app.patch("/tags/:id",async function (req, res) {

    try{
            const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {new: true}).lean().exec();

             return res.status(205).send(tag);
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})

app.delete("/tags/:id",async function (req, res) {

    try{
            const tag = await Tag.findByIdAndDelete(req.params.id).lean().exec();

             return res.status(200).json({tag: tag});
    }
    catch(err){
        return res.status(400).send(err.message);

    }
    
})



app.listen(2340,async ()=> {
    await connect();
    console.log("listening on port 2340");
})