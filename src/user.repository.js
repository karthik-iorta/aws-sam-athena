const AthenaExpress = require("athena-express");
const aws = require("aws-sdk");
const uniqid = require("uniqid");

aws.config.update({
    region: "ap-south-1"
});

const s3 = new aws.S3();
const athenaExpress = new AthenaExpress({ aws, db: "mydatabase" });

class UserRepository {

    async findAll() {
        const q = "SELECT * FROM users LIMIT 5;";
        return athenaExpress.query(q);
    }

    async findOne(id) {
        const q = `SELECT * FROM users WHERE id = '${id}' LIMIT 1;`;
        return athenaExpress.query(q);
    }

    async create(user) {
        if (user) {
            if (!user.id) {
                user.id = uniqid();
            }
            const q = `INSERT INTO users VALUES (
                    '${user.first_name}', 
                    '${user.last_name}', 
                    '${user.gender}', 
                    '${user.id}');`
            return athenaExpress.query(q);
        }
        return null;
    }

    async update(id, user) {
        if (id && user) {
            return new Promise(async (resolve, reject) => {
                const q1 = `SELECT * FROM users WHERE id = '${id}' LIMIT 1;`;
                const q2 = `SELECT "$path" FROM users WHERE id = '${id}' LIMIT 1;`;
                const userEntity = (await athenaExpress.query(q1)).Items[0];
                const path = (await athenaExpress.query(q2)).Items[0]['$path'];
                const regex = /s3:\/\/([a-z0-9\-]*)\/(.*)/;
                const matches = regex.exec(path);
                const bucket = matches[1];
                const key = matches[2];
                s3.deleteObject({
                    Bucket: bucket,
                    Key: key
                }, async (err, output) => {
                    if (err) {
                        return reject(err);
                    }
                    Object.assign(userEntity, user);
                    resolve(await this.create(user));
                });
            });
        }
        return null;
    }
}

module.exports = UserRepository;