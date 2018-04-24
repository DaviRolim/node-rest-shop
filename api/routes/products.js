const express = require('express')
const checkAuth = require('../middleware/check-auth')
const upload = require('../middleware/multerMiddleware')
const ProductsController = require('../contollers/products')

const router = express.Router()

router.get('/', ProductsController.get_all)

router.post('/',checkAuth , upload.single('productImage'), ProductsController.save)

router.get('/:productId', ProductsController.get_one)

router.patch('/:productId',checkAuth, ProductsController.update)

router.delete('/:productId',checkAuth, ProductsController.delete)

module.exports = router