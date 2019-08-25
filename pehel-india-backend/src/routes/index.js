import authRouter from './auth';
import userRouter from './user';
import updateRouter from './update'
import { isLoggedIn } from './utils';
import { NGOModel, CategoryModel, ReportModel } from '../models'
import _ from 'underscore';

export default (app, redis) => {
	app.use("/auth", authRouter(redis));
	app.use("/users", userRouter());
	app.use("/updates", updateRouter());

	app.post("/report", isLoggedIn({ error: "You are not logged in! Please login!" }),  async (req, res) => {
		if (!(['location', 'photo', 'desc', 'category'].every(key => _.has(req.body, key)))) {
			return res.json({ error: "Please provide the location, photo, description and category of report to publish it!"});
		}

		let Category = await CategoryModel.findOne({ name: req.body.category });

		if (!Category) {
			return res.json({ error: "Please provide a valid category for the report."});
		}

		let values = _.pick(req.body, ['location', 'photo', 'desc']);
		try {
const Report = new ReportModel({ ...values, location: { coordinates: values.location, type: "Point" }, category: Category._id, createdBy: req.session.user._id });

		await Report.save();

		return res.json({
			...Report,
			category: Category,
			createdBy: _.pick(req.session.user, ['name', 'phoneNo', 'type'])
		});
		} catch (e) {
			return res.json({ error: "Failed to save the report due to an internal error!"})
		}
	});
	app.get("/get-my-reports", isLoggedIn({ error: "You are not logged in! Please login!"}), async (req, res) => {
		let limit = req.query.limit || 10;
		let page = req.query.page || 1;

		if (limit > 100) {
			return res.json({ error: "The limit is too big for me to consider it seriously! "});
		}

		const Reports = await ReportModel.paginate({
			createdBy: req.session.user._id
		}, { page, limit, populate: ["createdBy", "category"] });

		Reports.docs = Reports.docs.map(doc => {
			doc.createdBy = _.pick(doc.createdBy, ['name', 'phoneNo', 'type'])
			return doc;
		});

		return res.json(Reports);
	});

	app.get("/get-ngo-reports", isLoggedIn({ error: "You are not logged In! Please Login!"}), async (req, res) => {
		if (req.session.user.type !== "ngo-owner") {
			return res.json({ error: "You are not authorized to use this method!"});
		}

		let limit = req.query.limit || 10;
		let page = req.query.page || 1;

		if (limit > 100) {
			return res.json({ error: "The limit is too big for me to consider it seriously! "})
		}

		const NGO = await NGOModel.findOne({ owner: req.session.user._id });

		if (!NGO) {
			return res.json({ error: "You are not attached to any ngo, hence you cannot see it's reports!"})
		}

		const Reports = await ReportModel.paginate({
			location: {
				$near: {
					$maxDistance: 1000 * 20, 
					$geometry: NGO.location,
				}
			}
		}, { limit, page, sort: { createdAt: 1 }, populate: "createdBy" });

		Reports.docs = Reports.docs.map(doc => {
			doc.createdBy = _.pick(doc.createdBy, ['name', 'phoneNo', 'type'])
			return doc;
		});
		return res.json(Reports);
	});
}