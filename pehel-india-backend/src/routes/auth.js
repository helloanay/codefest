import {Router} from 'express';
import { UserModel } from '../models';
import _ from 'underscore';
import { notLoggedIn, isLoggedIn } from './utils';

var AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
var sns = new AWS.SNS();



export default (redis) => {
	(async () => {
		await sns.setSMSAttributes({
			  attributes: { /* required */
			    'DefaultSMSType': 'Transactional'
			  }
		}).promise();
	})()

	const router = new Router();

	const phoneREGEX = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/gm;

	router.post("/get-otp", notLoggedIn({ error: "Sorry, you are already logged in." }), async (req, res) => {
		if (req.body.phoneNo && phoneREGEX.test(req.body.phoneNo)) {
			let otp = Math.random().toString().slice(3, 8);
			await redis.set(otp, req.body.phoneNo, "PX", 1000 * 60 * 5);

			try {
				var params = {
				  Message: `${otp} is your otp for PehelIndia, it expires in 5 minutes!`,
				  MessageStructure: 'string',
				  PhoneNumber: `+91${req.body.phoneNo}`
				};
				await sns.publish(params).promise()
			} catch (e) {
				return res.json({
					error: "Failed to send message to this mobile number, please try again later!"
				})
			}

			return res.json({
				error: null
			});
		}

		return res.json({
			error: "The entered mobile number is Invalid!"
		});
	});

	router.post("/login", notLoggedIn({ error: "Sorry, you are already logged in."}), async (req, res) => {
		if (req.body.otp) {
			let phoneNo = await redis.get(req.body.otp);

			if (phoneNo) {
				let User = await UserModel.findOne({ phoneNo: phoneNo });
				if (!User) {
					// create user
					User = new UserModel({
						phoneNo,
					});

					await User.save();
				}
				
				await redis.del(req.body.otp);
				req.session.user = User.toJSON();
				return res.json({ success: true, user: _.pick(User.toJSON(), ['name', 'phoneNo', 'type']) });
			}

			return res.json({
				error: "Psst! The otp you entered has been expired! Please try again!"
			})
		}

		return res.json({
			error: "OTP for login was not provided!"
		})
	});

	router.get('/get-me', isLoggedIn({ error: "Sorry but you're not logged In!"}), (req, res) => {
		return res.json( _.pick(req.session.user, ['name', 'phoneNo', 'type']))
	});

	return router;
};