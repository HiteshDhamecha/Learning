import { Request, Response } from 'express';
import { fetchDownloadUrl, downloadFile } from '../services/apiService';
import { extractTgz, getTodayFolderPath } from '../services/fileService';
import { uploadToBlobStorage } from '../services/blobService';
import * as fs from 'fs-extra';
import { runAdfPipeline } from '../services/adfService';
import { logger } from '../logger';

export const handleFileDownloadAndUpload = async (req: Request, res: Response) => {

    logger.info('API Call Started');

    const todayFolderPath = getTodayFolderPath();

    try {
        // Step 1: Get download URL
        const downloadUrl = await fetchDownloadUrl(req);
        console.log('Step 1: Get download URL Completed');
        logger.info('Step 1: Get download URL Completed');
        
        // Step 2: Download .tgz file
        const downloadPath = todayFolderPath + '/file.tgz';
        await downloadFile(downloadUrl, downloadPath);
        console.log('Step 2: Download .tgz file Completed');
        logger.info('Step 2: Download .tgz file Completed');
        
        // Step 3: Extract .tgz file
        await extractTgz(downloadPath, todayFolderPath);
        console.log('Step 3: Extract .tgz file Completed');
        logger.info('Step 3: Extract .tgz file Completed');
        
        // Step 4: Upload to Azure Blob Storage
        const containerName =String(process.env.AZURE_CONTAINER_NAME);
        const fileNames: string[] = await uploadToBlobStorage(todayFolderPath, containerName);
        console.log('Step 4: Upload to Azure Blob Storage Completed');
        logger.info('Step 4: Upload to Azure Blob Storage Completed');

        // Step 5: Trigger ADF Pipeline
        await runAdfPipeline(fileNames);
        console.log('Step 5: Trigger ADF Pipeline Completed');
        logger.info('Step 5: Trigger ADF Pipeline Completed');


        res.status(200).send('API Call Sucessfully Finished!');
        console.log('API Call Finished!');
        logger.info('API Call Finished!');

    } catch (error) {
        console.error(error);
        logger.error(error);
        res.status(500).send(`An error occurred during API call - error: ${error}`);
    } finally {
        // Cleanup: Delete the local download folder after process completes
        try {
            await fs.remove(todayFolderPath);
            console.log(`Deleted folder: ${todayFolderPath}`);
        } catch (err) {
            console.error(`Failed to delete folder ${todayFolderPath}:`, err);
            logger.error(`Failed to delete folder ${todayFolderPath}:`, err);
        }
    }
};