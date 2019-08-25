export const isLoggedIn = (json) =>  (req, res, next) => {
	if (
		typeof req.session.user === "undefined" ||
		typeof req.session.user.phoneNo === "undefined" 
	) {
		return res.json(json);
	}

	return next();
}

export const notLoggedIn = (json) => (req, res, next) => {
	if (
		typeof req.session.user === "undefined" ||
		typeof req.session.user.phoneNo === "undefined"
	) {
		return next();
	}
	return res.json(json);
}