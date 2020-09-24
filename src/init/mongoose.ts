import * as mongoose from 'mongoose';

export const initMongoose = (): void => {
    const connectionString = process.env.MONGODB_CONNECTION_STRING;
    if (!connectionString) {
        throw new Error('Connection string not specified');
    }

    mongoose.set('useCreateIndex', true);
    mongoose
        .connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .catch((err) => {
            console.log(err);
            process.exit(-1);
        });
};
