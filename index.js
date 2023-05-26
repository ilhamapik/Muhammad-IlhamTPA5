const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');


const Todo = require('./models').Todo
const User = require('./models').User

// get config vars
dotenv.config();

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = 3030

// kode utama
// melihat semua data

app.get('/todo', async(req, res) => {
    try {
        const Todos = await Todo.findAll();
        res.status(200).json(Todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// todo id
app.get('/todo/:id', async(req, res) => {
        try {
            Todos = await Todo.find({
                where: {
                    id: req.params.id,
                },
            });
            if (Todos) {
                res.status(200).json(Todos);
            } else {
                res.status(404).json({ message: 'Todo not found' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Error in getIdTodo',
            });
        }
    }),
    // nmabah Todo
    app.post('/todo/tambahh', async(req, res) => {
        try {
            const { title, description, status, isCompleted } = req.body;
            const newTodoData = {
                title: title,
                status: status,
                description: description,
                isCompleted: isCompleted ? isCompleted : false,
            };

            const todoData = await Todo.create(newTodoData);
            console.log(todoData);
            res.status(201).json({
                message: "new Todo created",
                todoData,
            });
        } catch (err) {
            res.status(500).json({
                message: err.message || "internal server error",
            });
        }
    }),
    // update
    app.put('/todo/update/:id', async(req, res) => {
        try {
            const { title, description, isCompleted } = req.body;
            const updateTodoData = {
                title: title,
                description: description,
                isCompleted: isCompleted,
            };

            const updateTodo = await Todo.update(updateTodoData, {
                where: {
                    id: req.params.id,
                },
            });

            res.status(200).json({
                message: "Update todo success",
            });
        } catch (err) {
            res.status(500).json({
                message: err.message || "Internal Server Error",
            });
        }
    });


// delete

app.delete('/todo/delete/:id', async(req, res) => {
        try {
            const deleteTodo = await Todo.destroy({
                where: {
                    id: req.params.id,

                },
            });
            res.status(200).json({
                message: "Delete todo success",
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: err.message || "Internal Server Error",
            });
        }
    }),


    // delete all

    app.delete('/delte/all', async(req, res) => {
        res.send();
    }),


    // user

    app.post("/user", async(req, res) => {
        let response = {}
        let code = 200
        if (req.body.email == "" || req.body.email == undefined) {
            code = 422
            response = {
                status: "SUCCESS",
                message: "email cannot be blank"
            }

        }
        if (req.body.password == "" || req.body.password == undefined) {
            code = 422
            response = {
                status: "SUCCESS",
                message: "password cannot be blank"
            }
        }
        try {
            const newUser = await User.create({
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            });

            response = {
                status: "SUCCESS",
                message: "Create User",
                data: newUser
            }
        } catch (error) {
            code = 422
            response = {
                status: "ERROR",
                message: error.parent.sqlMessage
            }
        }


        res.status(code).json(response)
        return
    })
    // login


app.post("/login", async(req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let response = {};
    let code = 200;

    try {
        // Cari pengguna berdasarkan email
        const Users = await User.findOne({ email: email });

        if (!Users) {
            code = 401;
            response = {
                status: "ERROR",
                message: "Invalid email or password"
            };
            res.status(code).json(response);
            return;
        }

        // Membandingkan password
        if (Users.password !== password) {
            code = 401;
            response = {
                status: "ERROR",
                message: "Invalid email or password"
            };
            res.status(code).json(response);
            return;
        }

        // Jika autentikasi berhasil, buat token JWT
        const token = jwt.sign({ UsersId: Users._id }, process.env.TOKEN_SECRET, {
            expiresIn: "1h"
        });

        response = {
            status: "SUCCESS",
            message: "Login successful",
            accessToken: token
        };
    } catch (error) {
        code = 500;
        response = {
            status: "ERROR",
            message: "Internal Server Error"
        };
    }

    res.status(code).json(response);
});


app.listen(port, () => {
    console.log(`This Application Run on Port : ${port}`)
})