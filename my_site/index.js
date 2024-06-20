require('dotenv').config();
const express = require('express')
const fileUploader = require('express-fileupload')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const AWS = require('aws-sdk')

const PORT = process.env.PORT || 5000

const app = express()

AWS.config.update({
    accessKeyId: 'YCAJEySXQZRgvNF8BVmz7kzwH',
    secretAccessKey: 'YCN_fCVUlbqXq56_xT96tgskXQK6G-q-SduPu8G9',
    region: 'ru-central1',
    endpoint: 'https://storage.yandexcloud.net',
});

const s3 = new AWS.S3();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/ejs'));

app.use(express.static('public'));
app.use(express.json());
app.use(fileUploader());

app.get('/', (req, res) => {
    res.render('course_creating');
});

app.get('/uploads', (req, res) => {
    res.json('Hello');
});

app.post('/uploads', (req, res) => {
    const serverFile = req.files.file_input;
    const params = {
        Bucket: 'webium',
        Key: serverFile.name,
        Body: serverFile.data,
    };

    s3.upload(params, function(err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('positive_addition_course.html');    
    });
});

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://a63282512:pBckr1CBnOuw6wcN@cluster0.cjpv3xq.mongodb.net/?retryWrites=true&w=majority')
        app.listen(PORT, () => console.log(`server started on port ${PORT}`))
    }

    catch (e) {
        console.error('Ошибка при запуске сервера:', e);
    }
}

start()