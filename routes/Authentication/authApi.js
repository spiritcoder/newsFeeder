const express = require('express')
const router = express.Router()

const authController = require('../../controllers/Authentication/auth.controller')


router.post('/register',authController.signup)
router.post('/signin',authController.signin)
router.post('/update_password',authController.updatePassword)



module.exports = router