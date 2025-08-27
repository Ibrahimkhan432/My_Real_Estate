import express from 'express';
import { updateUser } from '../controllers/user.controller';

const router = express.Router();

router.post('/update/:id', updateUser);