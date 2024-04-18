const {getDb} = require('../util/database');
const {ObjectId} = require("mongodb");

class MongoModel {
    static collectionName = 'admin';

    static collection () {
        return getDb().collection(this.collectionName)
    };

    constructor(id = null) {
        this._id = id ? new ObjectId(id): null;
    }

    async save() {
        try {
            let result;
            if (this._id) {
                result = await this.constructor.collection()
                    .updateOne(
                        {_id: this._id},
                        {$set: this}
                    );
            } else {
                result = await this.constructor.collection().insertOne(this);
            }
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    }

    static async fetchAll() {
        return await this.collection().find().toArray();
    }

    static async findById(prodId) {
        return await this.collection().findOne({_id: new ObjectId(prodId)})
    }

    static async deleteById(prodId) {
        return await this.collection().deleteOne({_id: new ObjectId(prodId)})
    }
}

module.exports = MongoModel;