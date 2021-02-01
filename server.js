const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 5001;
let Todo = require('./todo.model');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
  'mongodb+srv://Dimplemern:123123123@cluster0.srpfh.mongodb.net/todos?retryWrites=true&w=majority',
  { useNewUrlParser: true }
);
const connection = mongoose.connection;

// Once the connection is established, callback
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

todoRoutes.route('/todos').get((req, res) => {
  Todo.find((err, todos) => {
    if (err) console.log(err);
    else {
      res.json(todos);
    }
  });
});

todoRoutes.route('/:id').get((req, res) => {
  const id = req.params.id;
  Todo.findById(id, (err, todo) => {
    res.json(todo);
  });
});

todoRoutes.route('/todos/add').post((req, res) => {
  const todo = new Todo(req.body);
  console.log('req.body: ', req.body);
  todo
    .save()
    .then((todo) => {
      res.status(200).json({ todo: 'todo added successfully' });
    })
    .catch((err) => {
      res.status(400).send('adding new todo failed');
    });
});

todoRoutes.route('/todos/delete/:id').delete((req, res) => {
  const todo = new Todo(req.body);

  console.log('req.params.id: ', req.params.id);
  Todo.remove({ _id: req.params.id })
    .then((todo) => {
      res.status(200).json({ todo: 'todo deleted successfully' });
    })
    .catch((err) => {
      res.status(500).send('deleting new todo failed');
    });
});
todoRoutes.route('/todos/update/:id').put((req, res) => {
  Todo.findById(req.body._id, (err, todo) => {
    console.log('req.body: ', req.body);
    if (!todo) res.status(404).send('Data is not found');
    else {
      Todo.findOneAndUpdate(
        { _id: req.body._id },
        { $set: { text: req.body.text } },
        { new: true }
      )
        .then((todo) => {
          res.json('Todo updated');
        })
        .catch((err) => {
          res.status(400).send('Update not possible');
        });
    }
  });
});

app.use('/', todoRoutes);

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
