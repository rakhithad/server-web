const express = require('express');
const ProfileController = require('../controllers/ProfileController');
const { requireAuth } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.use(requireAuth); 

router.get('/', ProfileController.getMyProfile);

router.post('/', upload.single('profileImage'), ProfileController.upsertCoreProfile);

module.exports = router;