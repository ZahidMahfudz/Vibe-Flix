//router digunakan untuk mendefinisikan rute API atau endpoint

const express = require("express");
const { addUser, getUsers, getUser, editUser, removeUser } = require("../controller/userController");
const { authenticateToken, authorizeRole } = require("../middleware/authMiddleware");
const { userValidator } = require("../validator/userValidator");
const validate = require("../middleware/validate");

const router = express.Router();

router.post("/addUser", authenticateToken, authorizeRole(["ADMIN"]), addUser);           // POST /users/addUser
router.get("/getUsers", authenticateToken, authorizeRole(["ADMIN"]), getUsers);          // GET /users/getUsers
router.get("/getUserById/:id", authenticateToken, authorizeRole(["ADMIN"]), getUser);    // GET /users/getUserById/:id
router.put("/editUser/:id", authenticateToken, authorizeRole(["USER"]), userValidator, validate,  editUser);      // PUT /users/editUser/:id
router.delete("/deleteUser/:id", authenticateToken, authorizeRole(["ADMIN"]), removeUser);   // DELETE /users/deleteUser/:id

module.exports = router;
