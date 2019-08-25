import express from 'express';
import mongoose from 'mongoose';
import expressSession from 'express-session';
import 'dotenv/config';
import bodyParser from 'body-parser';
import ioredis from 'ioredis';
import setupRoutes from './routes';
import {CategoryModel} from './models';
import cors from 'cors';
var RedisStore = require('connect-redis')(expressSession);

const redis = new ioredis();

const app = express();

app.use(cors({ origin: "http://localhost:8080", credentials: true }))

app.use(bodyParser.json({}));

let sess = expressSession({
	secret: "oooh lalala super secret, saxyy 0xDUMBO00 0000H",
	resave: true,
	saveUninitialized: true,
	cookie: {
		expires: new Date(253402300000000) 
	},
	store: new RedisStore()
});

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(sess);
setupRoutes(app, redis);


mongoose.connect(process.env.URI, { useNewUrlParser: true }).then(
	async () => {
		console.log("connected to db")
		for (const category of ['food', 'education', 'children', 'women', 'elderly', 'differently abled', 'livelihoods']) {

			let cat = await CategoryModel.findOne({ name: category });

			if (!cat) {
				cat = new CategoryModel({ name: category });
				await cat.save();
				console.log("created category: ", category);
			}

		}

		app.listen(process.env.PORT, () => console.log("listening on port: " + process.env.PORT))
	},
	(e) => console.error(e)
)
