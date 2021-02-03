const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
// const jwt = require('jasonwebtoken')
const bcrypt = require('bcrypt');
const todoRoutes = express.Router();
const PORT = 5001;
let Todo = require('./todo.model');
const User = require('./user.model');
const { json } = require('body-parser');

const users = [];

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(
    'mongodb+srv://Dimplemern:123123123@cluster0.srpfh.mongodb.net/todos?retryWrites=true&w=majority', { useNewUrlParser: true }
);
const connection = mongoose.connection;

// Once the connection is established, callback
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

todoRoutes.route('/login').post((req, res) => {
    const login = new Todo(req.body);
    console.log('req.body: ', req.body);
    todo
        .then((login) => {
            res.status(200).json({ login: 'Logged in successfully' });
        })
        .catch((err) => {
            res.status(400).send('Login Not Successfull, Please Try Again!! ');
        });
});

app.get('/users', (req, res) => {
    res.json(users)
})

app.post(' /users/add', async(req, res) => {
    try {
        const salt = bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log(salt);
        console.log(hashedPassword);
        const user = {
            name: req.body.username,
            password: hashedPassword
        }
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500).send()
    }
})

app.post('/users/login', async(req, res) => {
    const user = users.find(user => user.name === req.body.username);
    if (user == null) {
        return res.status(400).send('Cannont find User')
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success!!')
        } else {
            res.send('Not Allowed')
        }
    } catch {
        res.status(500).send()
    }
})

todoRoutes.route('/signup').post((req, res) => {
    const user = new User(req.body);
    console.log('req.body: ', user);
    user
        .save()
        .then((todo) => {
            res.status(200).json({ msg: 'user added successfully!' });
        })
        .catch((err) => {
            res.status(400).send('adding new user failed!');
        });
});

// todoRoutes.route('/delete').delete((req, res) => {
//   const del = new User(req.body);
//       .then((del) => {
//           res.status(200).json({ del: 'User deleted successfully' });
//       })
//       .catch((err) => {
//           res.status(500).send('deleting new user failed');
//       });
// });

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
            Todo.findOneAndUpdate({ _id: req.body._id }, { $set: { text: req.body.text } }, { new: true })
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