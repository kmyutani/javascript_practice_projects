const router = require('express').Router();
const {addCategory, deleteCategory, updateCategory, viewUserCategories, viewAllCategories} = require('./../controllers/categoriesControllers');
const { verifyToken, verifyAdmin } = require('./../utils/auth');

router.post('/add', verifyToken, addCategory);

router.delete('/delete/:categoryId', verifyToken, deleteCategory);

router.patch('/update/:categoryId', verifyToken, updateCategory);

router.get('/myCategories', verifyToken, viewUserCategories);

router.get('/all', verifyToken, verifyAdmin, viewAllCategories);

module.exports = router;