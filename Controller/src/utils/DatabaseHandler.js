import { MongoClient } from 'mongodb';

class Database{

    constructor() {
        this.client = new MongoClient('mongodb://Asada:loreMipsum@cluster0-shard-00-00.vsc9z.mongodb.net:27017,cluster0-shard-00-01.vsc9z.mongodb.net:27017,cluster0-shard-00-02.vsc9z.mongodb.net:27017/?ssl=true&replicaSet=atlas-os25vg-shard-0&authSource=admin&retryWrites=true&w=majority')
        return;
    }

    async connect() {
        await this.client.connect();
        this.db = this.client.db('uSayit');

        return;
    }

    async getCookies() {
        this.collection = await this.db.collection('cookies');
        let cookies = (await this.collection.find({}, {projection: {id: 0}}).toArray())[0].cookies;

        return cookies;
    }
}

export default Database;