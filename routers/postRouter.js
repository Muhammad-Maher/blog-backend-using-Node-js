const express = require("express");
const postRouter = new express.Router();
const Post = require("../models/postsCollection");

//Base (/api/post)

/**
 * @swagger
 * components:
 *    schemas:
 *      Post:
 *        type: object
 *        required:
 *            - title
 *            - content
 *        properties:
 *          id:
 *            type: String
 *            description: auto generated id
 *          title:
 *            type: String
 *            description: post title
 *          content:
 *            type: String
 *            description: post content
 *          createdAt:
 *            type: Date
 *            description: post creation time
 *        example:
 *          id: "60c1f09e98bace3c748ffe61"
 *          title: "title"
 *          content: "content"
 *          createdAt: "2021-06-10T10:59:42.049Z"
 */

/**
 * @swagger
 * tags:
 *    name : Posts
 *    description : the posts APIs
 */
postRouter.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    await Post.create({
      title,
      content,
    });

    res.statusCode = 201;

    res.send({ message: "post created successfully" });
  } catch (err) {
    res.statusCode = 422;
    res.send(err);
  }
});

/**
 * @swagger
 * /api/post:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: The post was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: server error
 */

postRouter.get("/all", async (req, res, next) => {
  try {
    const posts = await Post.find({});
    res.send(posts);
  } catch (error) {
    res.statusCode = 422;
    res.send(error);
  }
});

/**
 * @swagger
 *  /api/post/all:
 *   get:
 *     summary: Get all posts
 *     tags : [Posts]
 *     responses:
 *       200:
 *         description: All posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */

postRouter.get("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    console.log(postId);
    const post = await Post.findById(postId).exec();
    console.log(post);
    res.send(post);
  } catch (error) {
    res.statusCode = 422;
    res.send(error);
  }
});

/**
 * @swagger
 * /api/post/{id}:
 *  get:
 *    summary: Get post by id
 *    tags: [Posts]
 *    parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: the post id
 *    responses:
 *        200:
 *          description: the post descriptoin
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#components/schemas/Post'
 *        404:
 *          description: the post was not found
 */

postRouter.put("/:id", async (req, res) => {
  try {
    let { title, content } = req.body;
    const postId = req.params.id;

    const oldData = await Post.findById(postId).exec();

    title = title || oldData.title;
    content = content || oldData.content;

    const user = await Post.updateOne(
      { _id: postId },
      {
        title,
        content,
      }
    );

    res.json("post updated successfully");
  } catch (error) {
    res.statusCode = 422;
    res.send(error);
  }
});

/**
 * @swagger
 * /api/post/{id}:
 *  put:
 *    summary: Update post by id
 *    tags: [Posts]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The post id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Post'
 *    responses:
 *      200:
 *        description: The post was updated Successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Post'
 *      404:
 *        description: The post was not found
 *      500:
 *        description: server error
 */

postRouter.delete("/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    await Post.deleteOne({ _id: postId });
    res.json("Post Deleted Successfully");
  } catch (error) {
    res.statusCode = 422;
    res.send(error);
  }
});

/**
 * @swagger
 * /api/post/{id}:
 *   delete:
 *     summary: Delete the post by id
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post id
 *     responses:
 *       200:
 *         description: The post was deleted Successfully
 *       404:
 *         description: The post was not found
 */

module.exports = postRouter;
