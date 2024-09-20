import { handleFileDownloadAndUpload } from './controllers/fileController';
import { Response,Request } from "express";


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', async (req: Request, res: Response) => {
    res.send('Server Running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// API to call crowwisdom API and store files on Storage
app.get('/api/injestCSVData', handleFileDownloadAndUpload);

