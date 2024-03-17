const cors = require("cors");
var express = require('express');
var path = require('path');
const Users = require('./models/users.js');
const jwt = require('jsonwebtoken');
const app = express();
const http = require('http');
var express = require('express');
var path = require('path');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/authMiddleware.js');
const dataMiddleware = require('./middleware/dataMiddleware.js');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const redis = require('redis');
//cache
const Memcached = require('memcached');
const memcached = new Memcached('localhost:11211');
//uplpad files
const multer = require('multer');
const aws = require('aws-sdk');
const dotenv = require('dotenv');
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');

dotenv.config();

const server = http.createServer(app);
const io = socketIo(server);

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({ dest: 'uploads/' });

// const client = redis.createClient();
// console.log("createClient");
// const client = redis.createClient({
//   url: 'redis://redis:6379'
// });


// (async () => {
//   await client.connect();
// })();

// client.on('connect', () => console.log('Redis Client Connected'));
// client.on('error', (err) => console.log('Redis Client Connection Error', err));


// client.on('error', err => console.log('Redis Client Error', err));
// client.connect();

app.use(express.static(path.join(__dirname, 'lab2-users/dist')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); //Разрешение на cors
app.use(bodyParser.json());


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

//port connection
app.listen(3000, ()=>{
  console.log('listen port 3000')
});

// Middleware для кэширования данных
// app.use((req, res, next) => {
//   console.log("Middleware для кэширования данных")
//   const key = req.url;

//   // Попытка получить данные из кэша Redis
//   // client.get(key, (err, data) => {
//   //   if (err) throw err;

//   //   // Если данные найдены в кэше, возвращаем их
// //   //   if (data !== null) {
// //   //     console.log(data);
// //   //     res.send(data);
// //   //   } else {
// //   //     // Если данных нет в кэше, продолжаем выполнение запроса
// //   //     next();
// //   //   }
// //   // });
// });

// Маршрут для получения данных из базы данных и сохранения их в кэше
// app.get('/api/users', async (req, res) => {
//   console.log(" api/users ");
//   try {
//     // Получаем данные из базы данных (например, MongoDB)
//     const data = await Users.find({});
//     console.log(data);
//     // Сохраняем данные в кэше Redis
//     //// client.setex(req.url, 3600, JSON.stringify(data));

//     res.json(data);
//   } catch (error) {
//     console.error('Failed to get data from database:', error);
//     res.status(500).json({ error: 'Failed to get data from database' });
//   }
// });


//get all users
// app.get('/api/users', async (req, res)=>{
//   try{
//     // client.connect();
//     client.get('users', (err, users) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ message: 'Internal Server Error' });
//       }
//       if (users) {
//         res.json(JSON.parse(users));
//       } else {
//         //save to cache
//         const users = Users.find({});
//         client.setex('users', 300, JSON.stringify(users));
//         res.json(users);
//       }
//     });

//     // client.quit((err, reply) => {
//     //   if (err) {
//     //     console.error(err);
//     //     return;
//     //   }
//     //   console.log('Client closed');
//     // });
//   } catch (error){
//     console.log("catch error");
//     res.status(500).json({message: error.message});
//   }
// });

// Функция для получения данных из кэша или из базы данных
function getData(callback) {
  console.log("try to get data function")
  memcached.get('users', (err, users) => {
    if (err) {
      console.log("error in memorycache")
      fetchDataFromDatabase((err, newUsers) => {
        if (err) {
          console.log("error in database")
          return callback(err);
        }

        // Сохраняем полученные данные в кэше
        memcached.set('users', newUsers, 3600, (err) => {
          if (err) {
            console.error('Failed to save users to cache:', err);
          }
        });

        callback(null, newUsers);
      });
      // return callback(err);
    }
    console.log("memcached get");
    if (users) {
      // Данные найдены в кэше
      console.log("users is finded");
      callback(null, users);
    } else {
      // Данные не найдены в кэше, получаем их из базы данных
      fetchDataFromDatabase((err, newUsers) => {
        if (err) {
          console.log("error in database")
          return callback(err);
        }

        // Сохраняем полученные данные в кэше
        memcached.set('users', newUsers, 3600, (err) => {
          if (err) {
            console.error('Failed to save users to cache:', err);
          }
        });

        callback(null, newUsers);
      });
    }
  });
}

// Функция для получения данных из базы данных (замените эту функцию на свою логику получения данных из базы данных)
function fetchDataFromDatabase(callback) {
  // Замените этот код на свою логику получения данных из базы данных
  const newUsers = Users.find({});
  console.log(newUsers);
  // const newData = { message: 'Hello, world!' };
  callback(null, newUsers);
}


// get all users
// app.get('/api/users', async(req, res)=>{
//   try{
//     // getData((err, data) => {
//     //   console.log("try to get data in api users")

//     //   if (err) {
//     //     console.error('Failed to get data:', err);
//     //   } else {
//     //     console.log("no err")
//     //     const users = data;
//     //     console.log('Data:', data);
//     //     res.json(users);
//     //   }
//     // });

//     const users = await Users.find({});
//     console.log(users);

//     // const users = getCachedData('users');
//     // if(!users)


//       // cacheData(users, users);
//     // }
//     res.status(200).json({users: users});
//   } catch (error){
//     console.log(error)
//     res.status(500).json({message: error.message});
//   }
// });


//file downloading
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;

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
    // fs.unlinkSync(file.path); // Удаляем временный файл
    console.log("file path " + file.path);
    res.status(200).send('File uploaded to S3.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to upload file to S3.');
  }
});

app.delete('/upload/:filename', async (req, res) => {
  const { filename } = req.params;

  // Удаление файла с сервера
  fs.unlinkSync(`uploads/${filename}`);

  // Удаление файла из облачного хранилища
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename
  };
  await s3.deleteObject(params).promise();

  res.send('File deleted.');
});

app.get('/upload', async (req, res) => {
  const files = fs.readdirSync('uploads');
  res.status(200).json(files);
});


//get all users
// app.get('/api/users', async (req, res) => {
//   try {
//     // Попробуйте получить данные из кэша Redis
//     try{
//       // const users = await client.get('users', async (err, cachedUsers));
//     }catch(err){
//       console.log('myerror, client does not work')
//       const users = await Users.find({});
//         // await client.set('users', JSON.stringify(users), (err, reply) => {
//           // if (err) {
//           //   console.error(err);
//           // } else {
//           //   console.log('Data saved to cache');
//           // }
//         // });
//         res.json(users);
//       // res.status(500).json({message: error.message});
//     }

//     await client.get('users', async (err, cachedUsers) => {
//       if (err) {
//         console.error(err);
//         throw err;
//       }

//       if (cachedUsers) {
//         // Если данные есть в кэше, отправьте их
//         console.log('Data from cache');
//         res.json(JSON.parse(cachedUsers));
//       } else {
//         // Если данных нет в кэше, получите их из MongoDB и сохраните в кэше
//         const users = await Users.find({});
//         client.set('users', JSON.stringify(users), (err, reply) => {
//           if (err) {
//             console.error(err);
//           } else {
//             console.log('Data saved to cache');
//           }
//         });
//         res.json(users);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// });

//get all users
app.get('/api/users', async(req, res)=>{
  try{
    const users = await Users.find({});
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
      // getCachedData(id, )
      const user = await Users.findById(id);
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

      if (user){
        if(user.password === pass){
          const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
          const currentUserId = user.id;
          return res.status(200).json({ message: 'Logged in successfully', token, currentUserId });
        }
      }
      else{
        res.status(500).json({message: 'Incorrect data'});
        console.log('Incorrect data');
      }

  } catch (error){
      console.log(error);
      res.status(500).json({message: error.message});
  }
})

//add new user
app.post('/api/users/reg', dataMiddleware, async(req, res) => {
  try{
      const user = await Users.create(req.body)
      console.log(user);
  } catch (error){
      console.error(error)
      // return throwError(error.error.message);
      return res.status(500).json({message: error.message});
  }
})

//update user
app.post('/api/users/update/:id', authMiddleware, async(req, res) => {
  try {
      const {id} = req.params;
      const user = await Users.findByIdAndUpdate(id, req.body);
      console.log("update user/ post")
      console.log(user);
      if(!user){
          return res.status(404).json({message: `cannot find any user with ID ${id}`})
      }

      const updatedUser = await Users.findById(id);
      console.log(updatedUser);
      res.status(200).send({user: updatedUser})
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

module.exports = app;
