import { logger } from '../logger';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Request } from 'express';
require('dotenv').config();

export const fetchDownloadUrl = async (req:Request): Promise<string> => {
    try{
        const timestamp = req.query.since;
        
        const downloadUrl=String(process.env.DOWNLOAD_URL);
        const deltaURL = String(process.env.DELTA_URL)+timestamp;
        const userName = String(process.env.USER);
        const password = String(process.env.PASSWORD);
    
        let apiURL
        if (!timestamp) {
            apiURL = downloadUrl;
        } else{
            apiURL = deltaURL;
        }

        axiosRetry(axios, { retries:  Number(process.env.RETRY_COUNT!),retryDelay:axiosRetry.exponentialDelay });

        const response = await axios.get(apiURL, {
            auth: {
                username: userName,
                password: password
            }
        });
        return response.data.url;
    }catch (error) {
        console.log(`Error calling CrowdWisdom API ${error}`);
        logger.error(`Error calling CrowdWisdom API ${error}`);
        throw error;
    }
};

export const downloadFile = async (url: string, downloadPath: string): Promise<void> => {
    try{
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        await new Promise((resolve, reject) => {
            const writer = require('fs').createWriteStream(downloadPath);
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }catch(error){
        logger.error(`Error in downloadfile ${error}`);
        console.log(`Error in downloadfile ${error}`);
        throw error;
    }
};
