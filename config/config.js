
require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGODB_URI,
    secretOrKey: process.env.SECRET_KEY,
    githubClientID: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET
};
