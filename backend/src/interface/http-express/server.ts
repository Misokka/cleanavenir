import 'dotenv/config';
import { startServer } from '../../infrastructure/bootstrap/server';


const port = Number.parseInt(process.env.EXPRESS_PORT || '3000', 10);

startServer(port);
