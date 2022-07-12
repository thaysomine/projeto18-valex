import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import 'dotenv/config';
import dotenv from 'dotenv';

import routers from './routers/index.js';
import errorHandler from './middlewares/errorHandler.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(routers);
app.use(errorHandler);

app.listen(+process.env.PORT || 5000, () => console.log(`Server started at port ${process.env.PORT}`));