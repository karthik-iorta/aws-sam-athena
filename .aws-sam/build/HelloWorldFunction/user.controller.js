'use strict'

const OK = 200;
const JSON_FORMAT = 'application/json';
const CONTENT_TYPE = 'Content-Type';

class UserController {

    async findAll(req, res) {
        const result = [
            { id: 1, name: "Karthik" },
            { id: 2, name: "Jeevesh" }
        ];
        res.status(OK)
            .header(CONTENT_TYPE, JSON_FORMAT)
            .send(JSON.stringify(result));
    }

    async findOne(req, res) {
        const result = { id: req.params.id, name: "Karthik" };
        res.status(OK)
            .header(CONTENT_TYPE, JSON_FORMAT)
            .send(JSON.stringify(result));
    }

    async create(req, res) {
        res.status(OK)
            .header(CONTENT_TYPE, JSON_FORMAT)
            .send(JSON.stringify(req.body));
    }

    async update(req, res) {
        res.status(OK)
            .header(CONTENT_TYPE, JSON_FORMAT)
            .send(JSON.stringify(req.body));
    }

    async delete(req, res) {
        res.status(OK)
            .header(CONTENT_TYPE, JSON_FORMAT)
            .send(req.params.id);
    }
}

module.exports = new UserController();