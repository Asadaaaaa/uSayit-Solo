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
        await this.discord.login();
        this.runAPI();
        
        return;
    }

    runAPI() {

        const api = this.api;

        api.use((req, res, next) => {
            
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', true);

            next();

            return;
        });

        api.use(express.json());

        api.use((err, req, res, next) => {
            
            if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {

                return res.status(400).json({
                    statusCode: 400, 
                    resCode: 'middleware-1', 
                    description: err.message
                });
            }

            next();

            return;
        })
        
        api.post('/api/sendMessage', async (req, res) => {

            let messageTxt = req.body.text;
            let isInstagram = req.body.instagram;
            let isTwitter = req.body.twitter;
            let timestamp = new Date().getTime();
        
            if(typeof messageTxt !== 'string' || messageTxt.length < 6 || messageTxt.length > 270) {
        
                res.status(405).json({
                    statusCode: 405, 
                    resCode: 'sendMessage-1', 
                    description: 'Text not valid'
                });
                console.log('\n\nEnd-Point: /api/sendMessage\nStatus: 405 Method Not Allowed\nDescription: Text not valid');
        
                return;
            }

            let messageTxtSplt = messageTxt.split(' ');
            let char = messageTxt.split('');

            let accCharacters = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890 ,./;\'[]\\-=_+{}:"<>?';
            let accCharArr = accCharacters.split('');

            let isLengthValid = true;
            let isInvalidChar = false;
        
            messageTxtSplt.forEach((val, idx, arr) => {
        
                if(val.length > 25) {
        
                    isLengthValid = false;
                    
                    return;
                }
        
            });

            char.forEach((val, idx, arr) => {

                let charFound = false;

                accCharArr.forEach((val2, idx2, arr2) => {

                    if(val === val2) {

                        charFound = true;

                    }

                });

                if(!charFound) {

                    isInvalidChar = true;

                    return;
                }

            });
        
            if(!isLengthValid) {
        
                res.status(405).json({
                    statusCode: 405, 
                    resCode: 'sendMessage-2', 
                    description: 'Text not valid, Maximum 25 char per words'
                });
                console.log('\n\nEnd-Point: /api/sendMessage\nStatus: 405 Method Not Allowed\nDescription: Text not valid, Maximum 25 char per words');
                
                return;
            } else if (isInvalidChar) {

                res.status(405).json({

                    statusCode: 405, 
                    resCode: 'sendMessage-3', 
                    description: 'Invalid Character'

                });
                console.log('\n\nEnd-Point: /api/sendMessage\nStatus: 405 Method Not Allowed\nDescription: Invalid character');

                return;
            }

            if(isInstagram !== true && isTwitter !== true) {

                res.status(405).json({
                    statusCode: 405,
                    resCode: 'sendMessage-3', 
                    description: 'No platforms found'
                });
                console.log('\n\nEnd-Point: /api/sendMessage\nStatus: 405 Method Not Allowed\nDescription: No platform found');

                return;
            }

            if(isInstagram) {

                await new ImageManipulation().save(messageTxt, timestamp);
                await this.instagram.postFeedMsg(messageTxt, timestamp);

            }

            if(isTwitter) {

                // Post a Twitt

            }

            res.status(200).json({

                statusCode: 200, 
                resCode: 'sendMessage-OK', 
                description: 'OK'

            });
            console.log('\n\nEnd-Point: /api/sendMessage\nStatus: 200 OK\nDescription: Succesfully sent feedback');
        
            return;
        });
        
        api.post('/api/igPreview', async (req, res) => {
            
            let previewTxt = req.body.text;

            if(typeof previewTxt !== 'string' || previewTxt.length < 6 || previewTxt.length > 270) {
                
                res.status(405).json({
                    
                    statusCode: 405,
                    resCode: 'igPreview-1',
                    description: 'Text not valid'
                    
                });
                console.log('\n\nEnd-Point: /api/igPreview\nStatus: 405 Method Not Allowed\nDescription: Text not valid');
        
                return;
            }
        
            let previewTxtSplt = previewTxt.split(' ');
            let char = previewTxt.split('');

            let accCharacters = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890 ,./;\'[]\\-=_+{}:"<>?';
            let accCharArr = accCharacters.split('');

            let isLengthValid = true;
            let isInvalidChar = false;
        
            previewTxtSplt.forEach((val, idx, arr) => {
        
                if(val.length > 25) {
        
                    isLengthValid = false;
                    
                    return;
                }
        
            });

            char.forEach((val, idx, arr) => {

                let charFound = false;

                accCharArr.forEach((val2, idx2, arr2) => {

                    if(val === val2) {

                        charFound = true;

                    }

                });

                if(!charFound) {

                    isInvalidChar = true;

                    return;
                }

            });
        
            if(!isLengthValid) {
        
                res.status(405).json({

                    statusCode: 405, 
                    resCode: 'igPreview-2', 
                    description: 'Text not valid, Maximum 25 char per words'

                });
                console.log('\n\nEnd-Point: /api/igPreview\nStatus: 405 Method Not Allowed\nDescription: Text not valid, Maximum 25 char per words');
                
                return;
            } else if (isInvalidChar) {

                res.status(405).json({

                    statusCode: 405, 
                    resCode: 'sendMessage-3', 
                    description: 'Invalid Character'

                });
                console.log('\n\nEnd-Point: /api/igPreview\nStatus: 405 Method Not Allowed\nDescription: Invalid character');

                return;
            }
        
            let image = await new ImageManipulation().preview(previewTxt);
            
            res.status(200).json({

                statusCode: 200, 
                resCode: 'igPreview-OK',
                image: image

            });
        
            console.log('\n\nEnd-Point: /api/igPreview\nStatus: 200 OK\nDescription: Succesfully show preview');
        
            return;
        });
        
        api.post('/api/sendFeedback', async (req, res) => {
            
            let feedbackTxt = req.body.text;
        
            if(typeof feedbackTxt !== 'string' || feedbackTxt.length <= 5 || feedbackTxt.length > 314) {
        
                res.status(405).json({

                    statusCode: 405,
                    resCode: 'sendFeedback-1',
                    description: 'Text not valid'

                });
                console.log('\n\nEnd-Point: /api/sendFeedback\nStatus: 405 Method Not Allowed\nDescription: Text not valid');
        
                return;
            }
        
            this.discord.sendFeedback(feedbackTxt);
        
            res.status(200).json({

                statusCode: 200, 
                resCode: 'sendFeedback-OK', 
                description: 'OK'

            });
            console.log('\n\nEnd-Point: /api/sendFeedback\nStatus: 200 OK\nDescription: Succesfully sent feedback');
            
            return;
        });
        
        api.listen(process.env.PORT || 3000)
        console.log("Server Running");

        return;
    }

}

new Main();
