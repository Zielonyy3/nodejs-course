const {getDb} = require('../util/database');
const {ObjectId} = require("mongodb");

class MongoModel {
    constructor(id = null) {
        this._id = id ? new ObjectId(id): null;
    }

    static collectionName = 'admin';

    static collection () {
        return getDb().collection(this.collectionName)
    };

    static async fetchAll() {
        return await this.collection().find().toArray();
    }

    static async findById(id) {
        return await this.collection().findOne({_id: new ObjectId(id)})
    }

    static async deleteById(id) {
        return await this.collection().deleteOne({_id: new ObjectId(id)})
    }

    getCollection() {
        return this.constructor.collection();
    }

    async save() {
        try {
            let result;
            if (this._id) {
                result = await this.getCollection()
                    .updateOne(
                        {_id: this._id},
                        {$set: this}
                    );
            } else {
                result = await this.getCollection().insertOne(this);
            }
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = MongoModel;