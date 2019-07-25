import express from 'express'
import authController from '../controllers/auth_controller'
import authValidations from '../middlewares/auth_middleware';
const routes = express.Router()
// hence we'll be using customized middlewares to validate all the auth requests
routes
.post('/auth/signup', authValidations.validateUser, authController.signup)
export default routes;