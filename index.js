require('dotenv').config()
const app = require('express')();
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Mongo DB is connected'))
.catch((err) => console.log(err));

app.use(bodyParser.json())

app.use(cors(
    {
        origin: process.env.ORIGIN,
        credentials: true
    }
));

app.use('/user', require('./routes/user.routes'));
app.use('/pet', require('./routes/pet.routes'));
app.use('/store', require('./routes/store.routes'));

app.listen(process.env.PORT, () => {
    console.log(`This app listening on port ${process.env.PORT}!`);
})