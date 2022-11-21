const Category = require('./../models/Categories');

// @path        api/categories/add  
// @method      POST
// @desc        create a category
// @privacy     NORMAL USER
// @body
    // @Required
    // type    
    // @Optional 
    // name     description
// @return      Details of the category created
module.exports.addCategory = async (req, res, next) =>{
    
    try {
        
        const category = new Category({
            ...req.body,
            userId: req.user._id
        });

        await category.save();
        res.status(201).send(category);

    } catch (err) {
        
        next(err);

    };
};

// @path        api/categories/delete/:categoryId  
// @method      DELETE
// @desc        Delete a category
// @privacy     NORMAL USER
// @return      "Deleted Category"
module.exports.deleteCategory = async (req, res, next) =>{

    try {
        
        const searchCategory = await Category.findById({
            userId: req.user._id, 
            _id: req.params.categoryId
        });
        if (!searchCategory) throw new Error("This category does not exist");

        // await Category.findByIdAndDelete({
        //     userId: req.user._id, 
        //     _id: req.params.categoryId
        // });

        await Category.findByIdAndUpdate({
            userId: req.user._id, 
            _id: req.params.categoryId
        },{isActive: false}, {new:true});

        res.status(200).send({message: "Category Deleted"});

    } catch (err) {
        
        next(err);

    };
};

// @path        api/categories/update/:categoryId  
// @method      PATCH
// @desc        Update the category
// @privacy     NORMAL USER
// @body
    // type   
    // name     description
// @return      Details of the updated category
module.exports.updateCategory = async (req, res, next) =>{

    try {
      
        const searchCategory = await Category.findById({
            userId: req.user._id, 
            _id: req.params.categoryId
        });
        if (!searchCategory) throw new Error("This category does not exist");

        const updateCategory = await Category.findByIdAndUpdate(
            {
                userId: req.user._id, 
                _id: req.params.categoryId
            },
            req.body,
            {new: true}    
        )

        res.status(202).send(updateCategory);

    } catch (err) {
        
        next(err);

    };
};

// @path        api/categories/myCategories
// @method      GET
// @desc        View all user categories in database
// @privacy     Dev
// @return      Details of the all user categories
module.exports.viewUserCategories = async (req, res, next) =>{

    try {
        
        const searchCategories = await Category.find({userId: req.user._id, }, {__v:0})

        res.send(searchCategories);
        
    } catch (err) {
        
        next(err);

    };
}

// @path        api/categories/all
// @method      GET
// @desc        View all categories in database
// @privacy     Dev
// @return      Details of the all categories
module.exports.viewAllCategories = async (req, res, next) =>{

    try {
        
        const searchCategories = await Category.find({}, {__v:0})

        res.send(searchCategories);
        
    } catch (err) {
        
        next(err);

    };
}