const Category = require('../models/Category');

class CategoryController {
    async getCategories(res) {
        try {
            const categories = await Category.find();
            res.json(categories);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new CategoryController();