'use strict'
const UserRepository = require("./user.repository");
const userRepository = new UserRepository();

const OK = 200;
const CREATED = 201;
const ACCEPTED = 202;
const ERROR = 500;
const JSON_FORMAT = 'application/json';
const CONTENT_TYPE = 'Content-Type';

class UserController {

    async findAll(req, res) {
        try {
            const users = await userRepository.findAll();
            ok(res, users);
        } catch (error) {
            err(res, error);
        }
    }

    async findOne(req, res) {
        try {
            const user = await userRepository.findOne(req.params.id);
            ok(res, user);
        } catch (error) {
            err(res, error);
        }
    }

    async create(req, res) {
        try {
            const user = await userRepository.create(req.body);
            ok(res, user);
        } catch (error) {
            err(res, error);
        }
    }

    async update(req, res) {
        try {
            const user = await userRepository.update(req.params.id, req.body);
            ok(res, user);
        } catch (error) {
            err(res, error);
        }
    }

    async delete(req, res) {
        try {
            const user = await userRepository.delete(req.params.id);
            ok(res, user);
        } catch (error) {
            err(res, error);
        }
    }
}

function ok(res, data) {
    try {
        res.status(OK)
            .header(CONTENT_TYPE, JSON_FORMAT)
            .send(JSON.stringify(data));
    } catch {
        res.status(OK)
            .header(CONTENT_TYPE, JSON_FORMAT)
            .send(data);
    }
}

function err(res, ex) {
    try {
        res.status(ERROR)
            .header(CONTENT_TYPE, JSON_FORMAT)
            .send(JSON.stringify({ message: ex.message, stack: ex.stack }));
    } catch {
        res.status(ERROR)
            .header(CONTENT_TYPE, JSON_FORMAT)
            .send(err);
    }
}

module.exports = new UserController();