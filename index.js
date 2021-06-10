const express = require("express");
const cors = require("cors");

// swagger-ui-express FOR GENERATING DOCUMENTATION UI
const swaggerUi = require("swagger-ui-express");

// SWAGGER jsdoc FOR WRITING THE DOCUMENTAION
const swaggerJsdoc = require("swagger-jsdoc");

// CONNECTION TO MONGO DB
require("./db_connection");

// CREATING THE APP
const app = express();

// USING ENVIROMENT VARAIBLE
const dotenv = require("dotenv");
dotenv.config();

// ASSIGNING THE POT
const port = process.env.PORT || 3000;

// IMPORT ROUTERS
const postRouter = require("./routers/postRouter");
const commentRouter = require("./routers/commentRouter");

// CROS ORIGIN RESOURCE SHARING
app.use(cors());

app.use(express.json());
app.use(express.static("public"));

app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog",
      version: "1.0.0",
      description: "simple blog (user, post, comment)",
    },
    server: [
      {
        url: process.env.URL || "http://localhost:3000/",
      },
    ],
  },
  apis: ["./routers/*.js"],
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const pathToSwaggerUi = require("swagger-ui-dist").absolutePath();
app.use(express.static(pathToSwaggerUi));

app.listen(port, () => {
  console.log(`Running at port ${port}`);
});
