
import { DataFactoryManagementClient } from '@azure/arm-datafactory';
import { EnvironmentCredential } from '@azure/identity';
import { logger } from '../logger';
import dotenv from 'dotenv';
dotenv.config();


const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID || '';
const resourceGroupName = process.env.RESOURCE_GROUP_NAME || '';
const factoryName = process.env.ADF_FACTORY_NAME || '';
const pipelineName = process.env.ADF_PIPELINE_NAME || '';

export const runAdfPipeline = async (fileNames:string[]) => {
    try {
        const credentials = new EnvironmentCredential();
        const client = new DataFactoryManagementClient(credentials, subscriptionId);
        for (const fileName of fileNames) {

            const parameters = {
                fileName: fileName!,
            };
            
            // Trigger the pipeline
            const runResponse = await client.pipelines.createRun(resourceGroupName, factoryName, pipelineName, {
                parameters: parameters
            });

            console.log(`Pipeline run triggered for file ${fileName} runID: ${runResponse.runId}`);
        }
    } catch (error) {
        console.log('Error triggering ADF pipeline:', error);
        logger.error('Error triggering ADF pipeline:', error);
        throw error;
    }
};
