import { Router } from 'express';
import { UserModel } from '../models';
import _ from 'underscore';
import { isLoggedIn } from './utils';

const router = new Router();

export default () => {
	
	router.post('/update-my-account', isLoggedIn({ error: "You are not logged in! Please login!"}), async (req, res) => {
		if (!req.body.name && !req.body.lastKnownLocation) {
			return res.json({ error: "Please provide either your name or your last known location to update!"})
		}
		let updates = _.pick(req.body, ['name', 'lastKnownLocation']);

		let User = await UserModel.findOneAndUpdate({ phoneNo: req.session.user.phoneNo }, updates, {
			new: true,
			useFindAndModify: false
		});

		req.session.user = User.toJSON();

		return res.json({ success: true, user: _.pick(req.session.user, ['name', 'phoneNo']) });
	});

	return router;	
}