import EncDec from './utils/EncDecAPI.js';
import DiscordBot from './platforms/DiscordBot.js';
import ImageManipulation from './utils/ImageManipulation.js';
import Database from './utils/DatabaseHandler.js';
import Instagram from './platforms/Instagram.js';

import express, { text } from 'express';

class Main {

    constructor() {
        this.main();
        
        return;
    }

    async main() {
        this.api =  express();
        this.db = new Database();
        this.instagram = new Instagram(this.db);

        this.discord = new DiscordBot();

        await this.db.connect();

        await this.instagram.run();
        this.runAPI();
        
        return;
    }

    runAPI() {
        const api = this.api;

        api.post('/api/sendMessage', async (req, res) => {
            let queryData = req.query.data;
            
            if(queryData === undefined || queryData === "" || queryData.length <= 10) {
        
                res.status(400).send("Bad Request");
                console.log('\n\nEnd-Point: /api/sendMessage\nStatus: 400 Bad Request\nDescription: Query data not valid');
        
                return;
            }
        
            let queryDataDec = EncDec.decryptor(queryData);
            
            try {
        
                var queryDataObj = JSON.parse(queryDataDec);
        
            } catch (err) {
        
                res.status(400).send("Bad Request");
                console.log('\n\nEnd-Point: /api/sendMessage\nStatus: 400 Bad Request\nDescription: Unable to json parsing');
        
                return;
            }
            
            let messageTxt = queryDataObj.text;
            let isInstagram = queryDataObj.instagram;
            let isTwitter = queryDataObj.instagram;
        
            if(typeof messageTxt !== 'string' || messageTxt.length <= 5 || messageTxt.length > 270) {
        
                res.status(405).send("Not Acceptable");
                console.log('\n\nEnd-Point: /api/sendMessage\nStatus: 400 Bad Request\nDescription: Text not valid');
        
                return;
            }
        
            let messageTxtSplt = messageTxt.split(' ');
            let isLengthValid = true;
        
            messageTxtSplt.forEach((val, idx, arr) => {
        
                if(val.length > 25) {
        
                    isLengthValid = false;
                    
                    return;
                }
        
            });
        
            if(!isLengthValid) {
        
                res.status(405).send("Not Acceptable");
                console.log('\n\nEnd-Point: /api/igPreview\nStatus: 405 Bad Request\nDescription: Text not valid, Maximum 25 char per words');
                
                return;
            }

            let timestamp = new Date().getTime();


            if(isInstagram) {

                await new ImageManipulation().save(messageTxt, timestamp);
                await this.instagram.postFeedMsg(messageTxt, timestamp);

            }

            if(isTwitter) {

                // Post a Twitt

            }

            res.status(200).send("OK");
            console.log('\n\nEnd-Point: /api/sendMessage\nStatus: 200 OK\nDescription: Succesfully sent feedback');
        
            return;
        });
        
        api.get('/api/igPreview', async (req, res) => {
            
            let queryData = req.query.data;
            
            if(queryData === undefined || queryData === "" || queryData.length <= 10) {
        
                res.status(400).send("Bad Request");
                console.log('\n\nEnd-Point: /api/igPreview\nStatus: 400 Bad Request\nDescription: Query data not valid');
        
                return;
            }
        
            
            let queryDataDec = EncDec.decryptor(queryData);
            
            try {
        
                var queryDataObj = JSON.parse(queryDataDec);
        
            } catch (err) {
        
                res.status(400).send("Bad Request");
                console.log('\n\nEnd-Point: /api/igPreview\nStatus: 400 Bad Request\nDescription: Unable to json parsing');
        
                return;
            }
            
            let previewTxt = queryDataObj.text;
            
            if(typeof previewTxt !== 'string' || previewTxt.length <= 5 || previewTxt.length > 270) {
        
                res.status(405).send("Not Acceptable");
                console.log('\n\nEnd-Point: /api/igPreview\nStatus: 405 Bad Request\nDescription: Text not valid');
        
                return;
            }
        
            let previewTxtSplt = previewTxt.split(' ');
            let isLengthValid = true;
        
            previewTxtSplt.forEach((val, idx, arr) => {
        
                if(val.length > 25) {
        
                    isLengthValid = false;
                    
                    return;
                }
        
            });
        
            if(!isLengthValid) {
        
                res.status(405).send("Not Acceptable");
                console.log('\n\nEnd-Point: /api/igPreview\nStatus: 405 Bad Request\nDescription: Text not valid, Maximum 25 char per words');
                
                return;
            }
        
            let image = await new ImageManipulation().preview(previewTxt);
        
            res.set({'Content-Type': 'image/png'});
            res.status(200).send(image);
        
            console.log('\n\nEnd-Point: /api/igPreview\nStatus: 200 OK\nDescription: Succesfully show preview');
        
            return;
        });
        
        api.post('/api/sendFeedback', async (req, res) => {
            
            let queryData = req.query.data;
            
            if(queryData === undefined || queryData === "" || queryData.length <= 10) {
        
                res.status(400).send("Bad Request");
                console.log('\n\nEnd-Point: /api/sendFeedback\nStatus: 400 Bad Request\nDescription: Query data not valid');
        
                return;
            }
        
            let queryDataDec = EncDec.decryptor(queryData);
            
            try {
        
                var queryDataObj = JSON.parse(queryDataDec);
        
            } catch (err) {
        
                res.status(400).send("Bad Request");
                console.log('\n\nEnd-Point: /api/sendFeedback\nStatus: 400 Bad Request\nDescription: Unable to json parsing');
        
                return;
            }
            
            let feedbackTxt = queryDataObj.text;
        
            if(typeof feedbackTxt !== 'string' || feedbackTxt.length <= 5 || feedbackTxt.length > 4000) {
        
                res.status(405).send("Not Acceptable");
                console.log('\n\nEnd-Point: /api/sendFeedback\nStatus: 400 Bad Request\nDescription: Text not valid');
        
                return;
            }
        
            this.discord.sendFeedback(feedbackTxt);
        
            res.status(200).send("OK");
            console.log('\n\nEnd-Point: /api/sendFeedback\nStatus: 200 OK\nDescription: Succesfully sent feedback');
            
            return;
        });
        
        api.listen(process.env.PORT || 3000)
        console.log("Server Running");
        return;
    }

}

new Main();