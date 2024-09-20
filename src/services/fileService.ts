import * as tar from 'tar';
import * as fs from 'fs-extra';
import * as path from 'path';
import { logger } from '../logger';


export const extractTgz = async (filePath: string, extractPath: string): Promise<void> => {
    try{
        await tar.x({
            file: filePath,
            cwd: extractPath
        });
    }catch(error){
        console.log(`Error in extractTgz function ${error}`);
        logger.error(`Error in extractTgz function ${error}`);
        throw error;
    }
};

export const getTodayFolderPath = (): string => {
    try{
        const today = new Date();
        const fileFolder = String(process.env.FILE_FOLDER);
        const folderName = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const folderPath = path.join(__dirname, '..', '..', fileFolder, folderName);
        fs.ensureDirSync(folderPath);
        return folderPath;
    }catch(error){
        console.log(`Error returning Folder Path ${error}`);
        logger.error(`Error returning Folder Path ${error}`);
        throw error;
    }
};
