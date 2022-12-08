const Joi = require('joi')
const express = require('express');
const app = express();
app.use(express.json());

const bugs = [
    { id: 1, name: 'bug1' },
    { id: 2, name: 'bug2' },
    { id: 3, name: 'bug3' },
]

app.get('/', (req, res) => {
    res.send("Health checking");
})

app.get('/api/bugs', (req, res) => {
    res.send(bugs);
})

app.post('/api/bugs', (req, res) => {
    const {error} = validateBug(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const bug = {
        id: bugs.length + 1,
        name: req.body.name
    };
    bugs.push(bug);
    res.send(bug)
})

app.put('/api/bugs/:id', (req, res) => {
    const bug = bugs.find(c => c.id === parseInt(req.params.id))
    if (!bug) return res.status(404).send("The bug ID is not found")
    const {error} = validateBug(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    bug.name = req.body.name;
    res.send(bug);
})

function validateBug(bug) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(bug, schema);
}

app.get('/api/bugs/:id', (req, res) => {
    const bug = bugs.find(c => c.id === parseInt(req.params.id))
    if (!bug) return res.status(404).send("The bug ID is not found")
    res.send(bug)
})

app.delete('/api/bugs/:id', (req, res) => {
    const bug = bugs.find(c => c.id === parseInt(req.params.id))
    if (!bug) return res.status(404).send("The bug ID is not found")
    const index=bugs.indexOf(bug);
    bugs.splice(index,1);
    res.send(bug)
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on the port ${port}`));