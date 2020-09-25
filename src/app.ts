import { initMongoose } from './init/mongoose';
import * as dotenv from 'dotenv';
import { registerRootRoute } from './Routes/Root';

dotenv.config();
initMongoose();
registerRootRoute();
