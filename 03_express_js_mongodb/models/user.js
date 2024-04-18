const {getDb} = require('../util/database');
const {ObjectId} = require("mongodb");

const collection = () => getDb().collection('users');

class User {
    constructor({username, email, id = null}) {
        this.username = username;
        this.email = email;
        this._id = id ? new ObjectId(id): null;
    }

    async save() {
        try {
            let result;
            if (this._id) {
                result = await collection()
                    .updateOne(
                        {_id: this._id},
                        {$set: this}
                    );
            } else {
                result = await collection().insertOne(this);
            }
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    }

    static async fetchAll() {
        return await collection().find().toArray();
    }

    static async findById(prodId) {
        return await collection().findOne({_id: new ObjectId(prodId)})
    }

    static async deleteById(prodId) {
        return await collection().deleteOne({_id: new ObjectId(prodId)})
    }
}

module.exports = Product;