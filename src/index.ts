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

const moment = require('moment');
// GET endpoint to accept datetime as a query parameter
app.get('/api/validate-datetime', (req: Request, res: Response) => {
    const since = req.query.since;
  
    // Define the expected format
    const format = 'YYYY-MM-DDTHH:mm:ss';
  
    // Check if the query parameter exists
    if (!since) {
      return res.status(400).json({ error: 'No datetime provided in query parameter' });
    }
  
    // Use moment.js to check if the datetime is valid
    const isValid = moment(since, format, true).isValid();
  
    if (isValid) {
      res.status(400).json({ message: 'Valid datetime', since });
    } else {
      res.status(400).json({ error: `Invalid datetime format. Expected format: ${format}` });
    }
  });