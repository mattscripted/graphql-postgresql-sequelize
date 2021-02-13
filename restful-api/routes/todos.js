const express = require('express')
const router = express.Router()
const todosController = require('../controllers').todos
const todoItemsController = require('../controllers').todoItems

router.post('/', todosController.create)
router.get('/', todosController.list)
router.get('/:todoId', todosController.retrieve)
router.put('/:todoId', todosController.update)
router.delete('/:todoId', todosController.destroy)

router.post('/:todoId/items', todoItemsController.create)
router.put('/:todoId/items/:todoItemId', todoItemsController.update)
router.delete(
  '/:todoId/items/:todoItemId', todoItemsController.destroy
)

// For any other request method on todo items, we're going to return "Method Not Allowed"
router.all('/:todoId/items', (req, res) =>
  res.status(405).send({
    message: 'Method Not Allowed'
  }))

module.exports = router
