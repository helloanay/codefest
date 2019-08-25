let {NGOModel, CategoryModel, UserModel} = require("./models");
import mongoose from 'mongoose';
import 'dotenv/config';

mongoose.connect("mongodb://admin:gOSoC5flTyG2kpc7@phl0-shard-00-00-on8wm.gcp.mongodb.net:27017,phl0-shard-00-01-on8wm.gcp.mongodb.net:27017,phl0-shard-00-02-on8wm.gcp.mongodb.net:27017/phl?ssl=true&replicaSet=phl0-shard-0&authSource=admin&retryWrites=true&w=majority", { useNewUrlParser: true }).then(
( async () => { 
console.log(await CategoryModel.findOne({}))
let n = new NGOModel({

	name: "The Dove Foundation",
	location: {
		type: "Point",
		coordinates: [52.902170, -1.860270]
	},
	address: "S-8/392 A1, Khajuri Gola, Varanasi, Uttar Pradesh 221002",
	phoneNo: "9555819879",
	categories: [await CategoryModel.findOne({})],
	owner: await UserModel.findOne({phoneNo: "8851250106"})

})


await n.save();

console.log(n);

}),
	(e) => console.error(e)
);