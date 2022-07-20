import EncDec from '../utils/EncDecAPI.js';
import Database from '../utils/DatabaseHandler.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import instagram from 'instagram-web-api';
import FileCookieStore from 'tough-cookie-filestore2';
import FS from 'fs-extra';

class Instagram {
    constructor(db) {   

        this.db = db;
        
        return;
    }

    async run() {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        let cookiesDB = await this.db.getCookies();

        if(cookiesDB !== "") {

            FS.writeFileSync(__dirname + '/../resources/cookies.json', cookiesDB);

        }

        let cookieStore = new FileCookieStore(__dirname + '/../resources/cookies.json');
        let username = 'usayit.id';
        let password = 'otech@usayit08';

        this.client = new instagram({username, password, cookieStore});

        await this.client.login({}, {_sharedData: false}).then(() => {

            console.log('(Instagram): Platform Status \x1b[93mEnabled\x1b[0m | Login as ' + username);

        }).catch((err) => {

            console.log('(Instagram) \x1b[91mERROR:\x1b[0m Platform Status \x1b[91mDisabled\x1b[0m');
            console.log(err)

        });

        let fileCookiesNew = FS.readFileSync(__dirname + '/../resources/cookies.json').toString();;
        await this.db.db.collection('cookies').updateOne({id: 0}, {$set: {cookies: fileCookiesNew}});

        return;
    }

    async postFeedMsg(message, timestamp) {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        let setCaption =  message;

        const photo = __dirname + '/../../server_data/igFeed/' + timestamp + '.jpg';

        let uploadData = await this.client.uploadPhoto({ photo, caption: setCaption, post: 'feed' }).then(() => {

            console.log('\n(Instagram) Successfully upload new broadcast on feed');
        
        });

        console.log(uploadData)

        return;
    }
}

export default Instagram;