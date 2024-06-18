import express from 'express';
import { register, login, getUsers, getAllUsers, updateUser, logout, updateRole } from '../controllers/UserController.js';
import { adminMiddleware, authMiddleware, superAdminMiddleware } from '../middleware/UserMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', authMiddleware, logout)
router.get('/me', authMiddleware, getUsers);
router.get('/all', authMiddleware, superAdminMiddleware, getAllUsers);
router.put('/updateUser', authMiddleware, updateUser);
router.put('/updateRole', authMiddleware, superAdminMiddleware, updateRole)

export default router;
