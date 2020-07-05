'use strict'
const UserRepository = require("./user.repository");
const userRepository = new UserRepository();

const OK = 200;
const CREATED = 201;
const ACCEPTED = 202;
const JSON_FORMAT = 'application/json';
const CONTENT_TYPE = 'Content-Type';

class UserController {

    async findAll(req, res) {
        res.status(OK)
            .header(CONTENT_TYPE, JSON_FORMAT)
            .send(JSON.stringify(await userRepository.findAll()));
    }

    async findOne(req, res) {
        res.status(OK)
            .header(CONTENT_TYPE, JSON_FORMAT)
            .send(JSON.stringify(await userRepository.findOne(req.params.id)));
    }

    async create(req, res) {
        res.status(OK)
            .header(CONTENT_TYPE, JSON_FORMAT)
            .send(JSON.stringify(await userRepository.create(req.body)));
    }

    async update(req, res) {
        res.status(OK)
            .header(CONTENT_TYPE, JSON_FORMAT)
            .send(JSON.stringify(await userRepository.update(req.params.id, req.body)));
    }

    async delete(req, res) {
        res.status(OK)
            .header(CONTENT_TYPE, JSON_FORMAT)
            .send(req.params.id);
    }
}

module.exports = new UserController();