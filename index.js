const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const AuthRoute = require("./routes/AuthRoute.js");
const CategoryRoute = require("./routes/CategoryRoute.js");
const TagRoute = require("./routes/TagRoute.js");
const PostRoute = require("./routes/PostRoute.js");
const CommentRoute = require("./routes/CommentRoute.js");
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(AuthRoute);
app.use(CategoryRoute);
app.use(TagRoute);
app.use(PostRoute);
app.use(CommentRoute);


app.listen(port, () => console.log(`Server running on port ${port}`));
