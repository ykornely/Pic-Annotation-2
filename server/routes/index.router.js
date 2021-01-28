const express = require('express');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage});

// ctrlUser has the exported register function from user.controller.js
const ctrlUser = require('../controllers/user.controller');
const ctrlPicture = require('../controllers/picture.controller');
const ctrlDrawing = require('../controllers/drawing.controller');

const jwtHelper = require('../config/jwtHelper');

// ctrlUser.register is the function which can handle the user sign up request from the client side (declined in user.controller)
router.post('/register', ctrlUser.register);

router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile', jwtHelper.verifyJwtToken, ctrlUser.userProfile); // private route, token required

router.post('/pictures', jwtHelper.verifyJwtToken, upload.single("picture"), ctrlPicture.postPicture);
router.get('/pictures', jwtHelper.verifyJwtToken, ctrlPicture.getPictures);

router.get('/pictures/:id', /*jwtHelper.verifyJwtToken,*/ ctrlPicture.downloadPicture);

router.get('/pictures/:pictureId/drawings', jwtHelper.verifyJwtToken, ctrlDrawing.getDrawings);
router.post('/pictures/:pictureId/drawings', jwtHelper.verifyJwtToken, ctrlDrawing.postDrawing);
router.patch('/pictures/:pictureId/drawings/:drawingId', jwtHelper.verifyJwtToken, ctrlDrawing.patchDrawing);

// using this exported router constant we can configure routing middleware inside this app
module.exports = router;