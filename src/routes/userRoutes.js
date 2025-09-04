//router digunakan untuk mendefinisikan rute API atau endpoint

const express = require("express");
const { addUser, getUsers, getUser, editUser, removeUser } = require("../controller/userController");

const router = express.Router();

router.post("/addUser", addUser);           // POST /users/addUser
router.get("/getUsers", getUsers);          // GET /users/getUsers
router.get("/getUserById/:id", getUser);    // GET /users/getUserById/:id
router.put("/editUser/:id", editUser);      // PUT /users/editUser/:id
router.delete("/deleteUser/:id", removeUser);   // DELETE /users/deleteUser/:id

module.exports = router;
