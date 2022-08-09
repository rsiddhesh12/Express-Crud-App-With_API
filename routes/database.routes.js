const express = require('express');
const router = express.Router()

const userController = require('../controllers/userController.js');
const productController = require('../controllers/productController.js');
const LogDataController = require('../controllers/logController.js');

router.get('/allUser', userController.getAllUsers);

router.get('/limitedUser/:limit/:offset', userController.getlimitedUsers);

router.post('/addUser', userController.addUser);

router.get('/:id', userController.getOneUser);

router.post('/:id', userController.updateUser);

router.delete('/:id', userController.deleteUser);

router.get('/product/allProduct', productController.getAllProducts);

router.get('/product/limitedProduct/:limit/:offset', productController.getlimitedProducts);

router.post('/product/addProduct', productController.addProduct);

router.get('/product/:id', productController.getOneProduct);

router.post('/product/:id', productController.updateProduct);

router.delete('/product/:id', productController.deleteProduct);


router.post('/logdata/createlLog', LogDataController.createLog);

router.get('/logdata/getLog', LogDataController.getLog);

module.exports = router