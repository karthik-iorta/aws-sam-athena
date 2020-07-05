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
        try {
            const q = "SELECT * FROM users LIMIT 1000;";
            const result = await athenaExpress.query(q);
            if (result.Items) {
                return result.Items;
            }
            return result;
        } catch (error) {
            throw error;
        }
    }

    async findOne(id) {
        try {
            const q = `SELECT * FROM users WHERE id = '${id}' LIMIT 1;`;
            const result = await athenaExpress.query(q);
            if (result.Items && result.Items.length > 0) {
                return result.Items[0];
            } else {
                throw new Error("No entity found for specified id: " + id);
            }
        } catch (error) {
            throw error;
        }
    }

    async create(user) {
        try {
            if (user) {
                if (!user.id) {
                    user.id = uniqid();
                }
                const q = `INSERT INTO users VALUES (
                    '${user.first_name}', 
                    '${user.last_name}', 
                    '${user.gender}', 
                    '${user.id}');`
                await athenaExpress.query(q);
                return user;
            }
            throw new Error("Invalid arguments.");
        } catch (error) {
            throw error;
        }
    }

    async update(id, user) {
        try {
            if (id && user) {
                let userEntity = await this.findOne(id);
                Object.assign(userEntity, user);
                await Promise.all([
                    this.delete(id),
                    this.create(userEntity)
                ]);
                return userEntity;
            }
            throw new Error("Invalid arguments.");
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            return new Promise(async (resolve, reject) => {
                const q = `SELECT "$path" FROM users WHERE id = '${id}' LIMIT 1;`;
                const data = await athenaExpress.query(q);
                if (data && data.Items && data.Items.length > 0) {
                    const path = data.Items[0]['$path'];
                    const regex = /s3:\/\/([a-z0-9\-]*)\/(.*)/;
                    const matches = regex.exec(path);
                    const bucket = matches[1];
                    const key = matches[2];
                    s3.deleteObject({
                        Bucket: bucket,
                        Key: key
                    }, async (err, result) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(`${id} deleted.`);
                    });
                } else {
                    reject(new Error("Failed to retrieve S3 path for user id: " + id));
                }
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserRepository;