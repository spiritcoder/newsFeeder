const express = require('express')
const router = express.Router()

const newsFeederController = require('../../controllers/newsFetch/fetchNewsController')

router.use('/get_news',newsFeederController.fetchAllNews)
router.use('/get_news_category/:category_name',newsFeederController.fetchCategoryNews)




module.exports = router