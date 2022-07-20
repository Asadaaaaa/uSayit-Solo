import { TwitterApi } from'twitter-api-v2';

class Twitter {

    constructor() {

        this.client = new TwitterApi({
            appKey: '',
            appSecret: '',
            accessToken: '',
            accessSecret: ''
        })

        return;
    }

};

export default Twitter;