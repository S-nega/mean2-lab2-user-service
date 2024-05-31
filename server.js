const cors = require("cors");
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const http = require('http');
var path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const redis = require('redis');

//links
const Users = require('./models/users.js');
const authMiddleware = require('./middleware/authMiddleware.js');
const dataMiddleware = require('./middleware/dataMiddleware.js');

//router
const newsRouter = require('./routes/news')

//cache
const Memcached = require('memcached');
const memcached = new Memcached('localhost:11211');

//uplpad files
const multer = require('multer');
const aws = require('aws-sdk');
const dotenv = require('dotenv');
const fs = require('fs');
const { sendEmail } = require('./utils/emailModul.js');
const { ApolloServer, gql } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./graphql/newsSchema.js');

dotenv.config();

const server = http.createServer(app);
const io = socketIo(server);
const MAX_FAILED_ATTEMPTS = 5;

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'lab2-users/dist')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); //Разрешение на cors
app.use(bodyParser.json());

app.use('/api/news', newsRouter);


// Настройка обработчиков событий для WebSocket endpoint
io.on('connection', socket => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('chat message', msg => {
    console.log('Message from client:', msg);
    io.emit('chat message', msg); // Отправляем сообщение обратно всем клиентам
  });
});


//mongoose connecting
mongoose.
connect('mongodb+srv://admin:admin@userslist.s6zf9e1.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
console.log('connected to MongoDB')
  }).catch((error) => {
    console.log(error)
})

//file downloading
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  console.log("server... ");

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileContent = fs.readFileSync(file.path);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.filename,
    Body: fileContent
  };

  try {
    await s3.upload(params).promise();
    fs.unlinkSync(file.path); // Удаляем временный файл

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${file.filename}`;
    res.status(200).json({ message: 'File uploaded to S3.', fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to upload file to S3.');
  }
});

//file delete
app.delete('/upload/:key', async (req, res) => {
  const { key } = req.params;
  console.log("key = " + key);
  // Удаление файла с сервера
  fs.unlink(`uploads/${key}`, (err) => {
    if (err) {
      console.error('Failed to delete file:', err);
      return;
    }
    console.log('File deleted successfully');
  });

  // Удаление файла из облачного хранилища
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key
  };
  await s3.deleteObject(params).promise();

  res.send('File deleted.');
});

//file get
app.get('/upload', async (req, res) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
    };

    const data = await s3.listObjectsV2(params).promise();

    // Преобразование объекта в массив файлов
    const files = data.Contents.map((item) => {
      return {
        Key: item.Key,
        LastModified: item.LastModified,
        Size: item.Size,
      };
    });
    // console.log("files: " + files[0].Key);
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//get all users
app.get('/api/users', async(req, res)=>{
  try{
    const users = await Users.find({}).select('name age');
    res.json(users);
  } catch (error){
    console.log(error)
    res.status(500).json({message: error.message});
  }
});

//get one user
app.get('/api/users/:id', async(req, res) => {
  try {
    const {id} = req.params;
    const user = await Users.findById(id).select('name age email password');
    // console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})

//authorize user
app.post('/api/users/auth', async(req, res) => {
  try{
      const email = req.body.email;
      const pass = req.body.password;
      const user = await Users.findOne({email: email});
      // console.log(Date.now());
      // console.log("lockUntil " + user.lockUntil);

      if (user){
        // Проверка на количество попыток ввода пароля
        if (user.lockUntil && user.lockUntil > Date.now()) {
          // Аккаунт заблокирован, показать сообщение об этом
          console.log('Account locked. Try again later. ' + user.lockUntil)
          return res.status(401).json({ message: 'Account locked. Try again later.' });
        }
        else{
          await Users.updateOne({ email: email }, { $set: { lockUntil: 0 } });
        }

        if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS && user.lockUntil < Date.now()) {
          console.log('Too many failed login attempts. Account locked.')
          await Users.updateOne(
            { email: email },
            { $set: { lockUntil: Date.now() + 60 * 1000, failedLoginAttempts: 4 } }
          );
          // console.log(user);
          return res.status(401).json({ message: 'Too many failed login attempts. Account locked.' });
        }
        
        // Проверка пароля
        if(user.password === pass){
          // Сброс счетчика неудачных попыток
          await Users.updateOne({ email: email }, { $set: { failedLoginAttempts: 0 } });

          const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
          const currentUserId = user.id;
          return res.status(200).json({ message: 'Logged in successfully', token, currentUserId });
        } else {
          // Увеличение счетчика неудачных попыток
          await Users.updateOne({ email: email }, { $inc: { failedLoginAttempts: 1 } });
          console.log("Incorrect password: " + email + " " + user.failedLoginAttempts)
          return res.status(401).json({ message: 'Incorrect password' });
        }
      }
      else{
        res.status(500).json({message: 'Incorrect email'});
        console.log('Incorrect email');
      }

  } catch (error){
    console.log(error);
    res.status(500).json({message: error.message});
  }
})

//add new user / registration
app.post('/api/users/reg', dataMiddleware, async(req, res) => {
  try{
      const user = await Users.create(req.body)
      // console.log(user);
      const email = req.body.email;
      await Users.updateOne({ email: email }, { $set: { failedLoginAttempts: 0 } });
      await sendEmail(email, 'Registration Successful', 'You have successfully registered.');
      // res.send('User registered successfully');
  } catch (error){
      console.error(error)
      // return throwError(error.error.message);
      return res.status(500).json({message: error.message});
  }
})

//update user / edit
app.post('/api/users/update/:id', authMiddleware, async(req, res) => {
  try {
    const {id} = req.params;
    const user = await Users.findByIdAndUpdate(id, req.body);
    console.log(user);

    if(!user){
      return res.status(404).json({message: `cannot find any user with ID ${id}`})
    }
    res.status(200).send({user: user})
  } catch (error) {
      res.status(500).json({message: error.message});
  }
})

//delete user
app.delete('/api/users/del/:id', authMiddleware, async(req, res) => {
  try{
    const {id} = req.params;
    const user = await Users.findByIdAndDelete(id);
    console.log(user);
    if(!user){
      return res.status(404).json({message: `cannot find any user with ID ${id}`})
    }
    res.status(200).send({user: user})

    } catch (error){
      res.status(500).json({message: error.message});
    }
  })


//apollo server
async function startApolloServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Можно передавать любые данные в контексте, если требуется
    }
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  // Запуск сервера
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`GraphQL server running at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  });
}

startApolloServer();
module.exports = app;