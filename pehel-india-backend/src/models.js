import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import cuid from 'cuid';

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const UserSchema = new mongoose.Schema({
	name: {
		type: String
	},
	phoneNo: {
		type: String,
		required: true,
		unique: true
	},
	type: {
		type: String,
		enum: ["regular", "ngo-owner", "admin"],
		required: true,
		default: "regular"
	},
	lastKnownLocation: {
		type: pointSchema
	}
});

export const UserModel = mongoose.model('User', UserSchema);

const NGOSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true,
		default: cuid
	},
	name: {
		type: String,
		required: true
	},
	location: {
		type: pointSchema,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	phoneNo: {
		type: String,
		required: true
	},
	categories: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category"
	}],
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
})


export const NGOModel = mongoose.model('NGO', NGOSchema)

const CategorySchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true,
		default: cuid
	},
	name: {
		type: String,
		required: true
	}
})

export const CategoryModel = mongoose.model('Category', CategorySchema)

const UpdateSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
		unique: true,
		default: cuid
	},
	title: String,
	desc: String,
	body: String,
	featurePhotoURI: String,
	publishedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "NGO",
		required: true,
	},
	type: {
		type: String,
		enum: ["alert", "news", "update"]
	}
}, {
	timestamps: true
});

UpdateSchema.plugin(mongoosePaginate);

export const UpdateModel = mongoose.model("Update", UpdateSchema);

const ReportSchema = new mongoose.Schema({
	location: {
		type: pointSchema,
		required: true
	},
	photo: {
		type: String,
		required: true
	},
	desc: {
		type: String,
		required: true
	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Category",
		required: true
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	}
}, {
	timestamps: true
});

ReportSchema.plugin(mongoosePaginate);

export const ReportModel = mongoose.model("Report", ReportSchema)