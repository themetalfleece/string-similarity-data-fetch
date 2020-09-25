import { IKeyDataAttributes, KeyData } from './Models/KeyData';
import * as stringSimilarity from 'string-similarity';

type IKeyDataAttributesNoGroup = Omit<IKeyDataAttributes, 'group'>;

export class StringSimilarityDataFetch {
    private data: IKeyDataAttributesNoGroup[] = [];

    public constructor(
        private group: string,
        private threshold: number = 0.3,
    ) {}

    /** removes the data from the database */
    public async clearData(): Promise<void> {
        await KeyData.deleteMany({});
        this.data = [];
    }

    /** loads data from the database */
    public async loadData(): Promise<void> {
        const allData = await KeyData.find({ group: this.group });
        this.data = allData.map(({ data, key }) => ({
            data,
            key,
        }));
    }

    /** adds data to the database */
    public async addData(
        data: IKeyDataAttributesNoGroup | IKeyDataAttributesNoGroup[],
    ): Promise<void> {
        const dataToCreate: IKeyDataAttributes[] = (data instanceof Array
            ? data
            : [data]
        ).map((d) => ({
            ...d,
            key: d.key.toLowerCase(),
            group: this.group,
        }));

        await KeyData.insertMany(dataToCreate);
        this.data.push(...dataToCreate);
    }

    /** gets data by the best match */
    public async getDataBySimilarity(
        searchString: string,
    ): Promise<(IKeyDataAttributesNoGroup & { similarity: number }) | null> {
        const allKeys = this.data.map(({ key }) => key);
        if (!allKeys.length) {
            throw new Error('no entries match this group');
        }

        const bestMatchResult = stringSimilarity.findBestMatch(
            searchString.toLowerCase(),
            allKeys,
        );

        if (bestMatchResult.bestMatch.rating < this.threshold) {
            return null;
        }

        const { bestMatchIndex } = bestMatchResult;
        const bestMatchData = this.data[bestMatchIndex];

        return {
            key: bestMatchData.key,
            data: bestMatchData.data,
            similarity: bestMatchResult.bestMatch.rating,
        };
    }
}
