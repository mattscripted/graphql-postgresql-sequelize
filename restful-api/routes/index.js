const express = require('express')
const router = express.Router()
const todosRouter = require('./todos')

router.use('/todos', todosRouter)

module.exports = router
