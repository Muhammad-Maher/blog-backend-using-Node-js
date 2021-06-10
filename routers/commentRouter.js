const express = require("express");
const commentRouter = new express.Router();
const Comment = require("../models/commentsCollection");

//Base (/api/comment)

/**
 * @swagger
 * components:
 *    schemas:
 *      Comment:
 *        type: object
 *        required:
 *            - content
 *        properties:
 *          id:
 *            type: String
 *            description: auto generated id
 *          content:
 *            type: String
 *            description: comment content
 *          createdAt:
 *            type: Date
 *            description: comment creation time
 *          postId:
 *            type: String
 *            description: the post that has the comment
 *        example:
 *          id: 0
 *          content: 0
 *          createdAt: 0
 *          postId: 0
 */

/**
 * @swagger
 * tags:
 *    name : Comments
 *    description : the comments APIs
 */

commentRouter.post("/", async (req, res) => {
  try {
    const { content, postId } = req.body;

    await Comment.create({
      content,
      postId,
    });

    res.statusCode = 201;

    res.send({ message: "Comment Created Successfully" });
  } catch (err) {
    res.statusCode = 422;
    res.send(err);
  }
});

/**
 * @swagger
 * /api/comment:
 *   post:
 *     summary: Create a new comment
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     responses:
 *       200:
 *         description: The comment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: server error
 */

commentRouter.get("/all", async (req, res, next) => {
  try {
    const comments = await Comment.find({}).populate("postId");
    res.send(comments);
  } catch (error) {
    res.statusCode = 422;
    res.send(error);
  }
});

/**
 * @swagger
 *  /api/comment/all:
 *   get:
 *     summary: Get all comment
 *     tags : [Comments]
 *     responses:
 *       '200':
 *         description: A list of comments.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */

commentRouter.get("/:id", async (req, res) => {
  try {
    const commentId = req.params.id;
    const comment = await Comment.findOne({ _id: commentId }).exec();
    res.send(comment);
  } catch (error) {
    res.statusCode = 422;
    res.send(error);
  }
});

/**
 * @swagger
 *  /api/comment/{id}:
 *    get:
 *      summary: Get comment by id
 *      tags: [Comments]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: the comment id
 *      responses:
 *        200:
 *          description: the comment descriptoin
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#components/schemas/Comment'
 *        404:
 *          description: the comment was not found
 */

commentRouter.put("/:id", async (req, res) => {
  try {
    let { content } = req.body;

    const commentId = req.params.id;

    const oldData = await Comment.findById(commentId).exec();

    content = content || oldData.content;

    const user = await Comment.updateOne(
      { _id: commentId },
      {
        content,
      }
    );
    res.json("Comment Updated Successfully");
  } catch (error) {
    res.statusCode = 422;
    res.send(error);
  }
});

/**
 * @swagger
 * /api/comment/{id}:
 *  put:
 *    summary: Update comment by id
 *    tags: [Comments]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The comment id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Comment'
 *    responses:
 *      200:
 *        description: The comment was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Comment'
 *      404:
 *        description: The comment was not found
 *      500:
 *        description: server error
 */

commentRouter.delete("/:id", async (req, res) => {
  try {
    const commentId = req.params.id;
    await Comment.deleteOne({ _id: commentId });
    res.json("Comment Deleted Successfully");
  } catch (error) {
    res.statusCode = 422;
    res.send(error);
  }
});

/**
 * @swagger
 * /api/comment/{id}:
 *   delete:
 *     summary: Remove the comment by id
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The comment id
 *     responses:
 *       200:
 *         description: The comment was deleted
 *       404:
 *         description: The comment was not found
 */

module.exports = commentRouter;
