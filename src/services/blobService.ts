import { BlobServiceClient } from '@azure/storage-blob';
import { logger } from '../logger';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING = String(process.env.AZURE_STORAGE_CONNECTION_STRING);

export const uploadToBlobStorage = async (localFolderPath: string, containerName: string) => {
    try{
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Create a folder name based on today's date
        const today = new Date();
        const folderName = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}/`;

        // Check if the folder (prefix) exists by listing blobs with the folder prefix
        // const folderExists = await containerClient.listBlobsByHierarchy(folderName).next();
        //if (!folderExists.done) {
        
            const files = fs.readdirSync(localFolderPath);
            const excludeFiles = process.env.EXCLUDE_FILES!
            const excludeFilesArray = excludeFiles.split(',').map(file => file.trim());

            for (const fileName of files) {
                if(!excludeFilesArray.includes(fileName)) {
                    if (path.extname(fileName).toLowerCase() === '.csv') {
                    const filePath = path.join(localFolderPath, fileName);
                    const blobName = folderName + fileName;  // Include the folder name in the blob path
                    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

                    const fileStream = fs.createReadStream(filePath);
                    const uploadBlobResponse = await blockBlobClient.uploadStream(fileStream);
                    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
                    }
                }
            }
        return files.filter(file => !excludeFilesArray.includes(file));
        // }
    }catch(error){        
        console.log(`Error in uploadToBlobStorage function ${error}`);
        logger.error(`Error in uploadToBlobStorage function ${error}`);
        throw error;
    }
};