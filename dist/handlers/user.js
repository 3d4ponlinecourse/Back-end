"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newHandlerUser = void 0;
const bcrypt_1 = require("../auth/bcrypt");
// import { JwtAuthRequest } from "../auth/jwt";
const jwt_1 = require("../auth/jwt");
//export
function newHandlerUser(repo, repoBlacklist) {
    return new HandlerUser(repo, repoBlacklist);
}
exports.newHandlerUser = newHandlerUser;
//create handler
class HandlerUser {
    constructor(repo, repoBlacklist) {
        this.repo = repo;
        this.repoBlacklist = repoBlacklist;
    }
    //register
    async register(req, res) {
        const { username, password, firstname, lastname, email, gender } = req.body;
        if (!username ||
            !password ||
            !firstname ||
            !lastname ||
            !email ||
            !gender) {
            return res
                .status(400)
                .json({ error: " missing some fields in body" })
                .end();
        }
        try {
            const user = await this.repo.createUser({
                username,
                firstname,
                lastname,
                password: await (0, bcrypt_1.hashPassword)(password),
                email,
                gender,
            });
            return res
                .status(201)
                .json({ ...user, password: undefined })
                .end();
        }
        catch (err) {
            const errMsg = `failed to create account: ${username}`;
            console.log({ error: `${errMsg}: ${err}` });
            return res.status(500).json({ error: errMsg }).end();
        }
    }
    //login
    async login(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(400)
                .json({ error: "missing username or password" })
                .end();
        }
        return this.repo
            .getUser(username)
            .then((user) => {
            if (!(0, bcrypt_1.compareHash)(password, user.password)) {
                return res
                    .status(401)
                    .json({ error: "invalid name or password" })
                    .end();
            }
            const payload = { id: user.id, username: user.username };
            const token = (0, jwt_1.newJwt)(payload);
            return res
                .status(200)
                .json({ status: "logged in", accessToken: token })
                .end();
        })
            .catch((err) => {
            console.error(`failed to get user: ${err}`);
            return res.status(500).end();
        });
    }
    async logout(req, res) {
        return await this.repoBlacklist
            .addToBlacklist(req.token)
            .then(() => res.status(200).json({ status: `logged out`, token: req.token }).end())
            .catch((err) => {
            console.error(`failed to logout`);
            return res.status(500).end();
        });
    }
}
//# sourceMappingURL=user.js.map