const createpost = require("../controller/posts").createpost;
const getPosts = require("../controller/posts").getPosts;
const likepost = require("../controller/posts").likepost;
const commentpost = require("../controller/posts").commentpost;
const getuserpost = require("../controller/posts").getuserpost;
const getpost = require("../controller/posts").getpost;
const getpostlike = require("../controller/posts").getpostlike;
const getpostlikecount = require("../controller/posts").getpostlikecount;
const getpostcomment = require("../controller/posts").getpostcomment;
const getpostcommentcount = require("../controller/posts").getpostcommentcount;
const deletepost = require("../controller/posts").deletepost;
const getprofile = require("../controller/posts").getprofile;
const authmiddleware = require("../middleware/auth");

const router = require("express").Router();

router.post("/createpost", authmiddleware, createpost);
router.get("/getposts", getPosts);
router.put("/likepost/:postId", authmiddleware, likepost);
router.put("/commentpost/:postId", authmiddleware, commentpost);
router.get("/getuserpost/:userId", getuserpost);
router.get("/getpost/:postId", getpost);
router.get("/getpostlike/:postId", getpostlike);
router.get("/getpostlikecount/:postId", getpostlikecount);
router.get("/getpostcomment/:postId", getpostcomment);
router.get("/getpostcommentcount/:postId", getpostcommentcount);
router.delete("/deletepost/:postId", authmiddleware, deletepost);
router.get("/getprofile/:userId", authmiddleware, getprofile);

module.exports = router;
