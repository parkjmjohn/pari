const express = require('express');
const cors = require("cors");
const Joi = require('joi');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const users = [
    { user_id: 1, first_name: 'John', last_name: 'Park', phone_number: '6464610807' },
    { user_id: 2, first_name: 'Mia', last_name: 'Park', phone_number: '7185337023' },
    { user_id: 3, first_name: 'Eleanor', last_name: 'Glenn', phone_number: '9704880994' },
];

function validateUser(user) {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        phone_number: Joi.string().required(),
    });
    return schema.validate(user);
};

app.get('/', (req, res) => {
    res.send('Welcome to Pari');
});

app.get('/api/users', (req, res) => {
    res.send(users);
});

app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.user_id == parseInt(req.params.id));
    if (!user) return res.status(404).send('User does not exist');
    res.send(user);
});

app.post('/api/users', (req,res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message)
    const user = {
        user_id: users.length + 1,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone_number: req.body.phone_number,
    };
    users.push(user);
    res.send(user);
});

app.delete('/api/users/:id', (req, res) => {
    const user = users.find(u => u.user_id == parseInt(req.params.id));
    if (!user) return res.status(404).send('User does not exist');
    const index = users.indexOf(user)
    users.splice(index, 1)
    res.send(user)
});

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on ${port}`))