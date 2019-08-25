import { Router } from 'express';
import _ from 'underscore';
import { isLoggedIn } from './utils';
import { NGOModel, UpdateModel } from '../models'

export default () => {
	const router = new Router();

	// TODO: TEST IT LATER
	router.get("/", isLoggedIn({ error: "You are not logged in! Please login!"}), async (req, res) => {

		let page = req.query || 1;
		let limit = req.limit || 10;
		if (limit > 100) {
			return res.json({ error: "The limit is too darn high for me to process this request seriously."})
		}

		let isGeoSearch = Boolean(req.session.user.lastKnownLocation);
		let query = {};

		if (isGeoSearch) {
			let NGOs = (await NGOModel.find().where('location').near({ center: req.session.user.lastKnownLocation }).exec())
			.map(
				ngo => ngo._id
			);

			if (NGOs.length > 0) {
				query.publishedBy = {
					id: { $in: NGOs }
				}
			}
		}

		let Updates = await UpdateModel.paginate(query, {
			populate: "publishedBy",
			sort: { createdAt: 1 },
			page,
			limit,
		});


		return res.json(Updates);
	});

	// TODO: TEST IT LATER.
	router.post("/publish", isLoggedIn({ error: "You are not logged in! Please login!" }), async (req, res) => {
		if (!(['title', 'body', 'type'].every(key => _.has(req.body, key)))) {
			return res.json({ error: "Please provide the title, body and type of update to publish it!"});
		}

		if (req.session.user.type !== "ngo-owner") {
			return res.json({ error: "You do not have the required permissions to publish an update!"});
		}

		const NGO = await NGOModel.findOne({ owner: req.session.user._id });

		if (!NGO) {
			return res.json({ error: "You're not attached to the NGO, hence you cannot publish an update!"});
		}

		let values = _.pick(req.body, ['title', 'desc', 'body', 'featurePhotoURI', 'type']);
		const Update = new UpdateModel({
			...values,
			publishedBy: req.session.user._id
		});

		await Update.save();

		return {
			...Update.toJSON(),
			publishedBy: _.pick(req.session.user, ['name', 'phoneNo'])
		};
	});

	return router;
}