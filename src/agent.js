import superagentPromise from "superagent-promise";
import _superagent from "superagent";

const superagent = superagentPromise(_superagent, global.Promise);

// API to fetch data.
const API_ROOT = "https://www.reddit.com/r/";

const responseBody = res => res.body;

const requests = {
	get: url => superagent.get(`${API_ROOT}${url}`).then(responseBody)
};

const Home = {
	subreddit: value => requests.get(`${value}.json`)
};

export default {
	Home
};
