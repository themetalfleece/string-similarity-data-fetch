import * as mongoose from 'mongoose';
import { Document, Model, Schema } from 'mongoose';

export interface IKeyDataAttributes {
    /** key to be used when searching by string similarity */
    key: string;
    /** group/category this data belongs to */
    group: string;
    /** data which correspond to this key */
    data: Array<{
        name: string;
        value: string;
    }>;
}

export interface IKeyDataDocument extends Document, IKeyDataAttributes {}

export interface IKeyData extends IKeyDataDocument {}

export interface IKeyDataModel extends Model<IKeyData> {
    getBySimilarity(searchString: string): IKeyData;
}

const KeyDataSchema: Schema = new Schema(
    {
        key: {
            type: mongoose.SchemaTypes.String,
            required: true,
            minlength: 1,
            trim: true,
            unique: true,
        },
        data: {
            type: [
                new Schema(
                    {
                        name: {
                            type: mongoose.SchemaTypes.String,
                            required: true,
                        },
                        value: {
                            type: mongoose.SchemaTypes.String,
                            required: true,
                        },
                    },
                    { _id: false },
                ),
            ],
            required: true,
        },
        group: {
            type: mongoose.SchemaTypes.String,
            required: true,
            minlength: 1,
            trim: true,
            index: true,
        },
    },
    { collection: 'keydata' },
);

export const KeyData = mongoose.model<IKeyData, IKeyDataModel>(
    'KeyData',
    KeyDataSchema,
);
