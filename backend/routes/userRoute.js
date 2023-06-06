const express = require('express')
const router = express.Router();
const { isAuthenticatedUser, authorizeRole } = require('../middleware/auth');
const {register, login, logout, forgetPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser} = require( '../controllers/userController');

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/password/forgot").get(forgetPassword);
router.route("/logout").get(logout);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/password/updateProfile").put(isAuthenticatedUser, updateProfile);router
.route("/admin/users")
.get(isAuthenticatedUser, authorizeRole("admin"), getAllUser);

router
.route("/admin/user/:id")
.get(isAuthenticatedUser, authorizeRole("admin"), getSingleUser)
.put(isAuthenticatedUser, authorizeRole("admin"), updateUserRole)
.delete(isAuthenticatedUser, authorizeRole("admin"), deleteUser);

module.exports = router