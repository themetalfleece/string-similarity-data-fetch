import * as Koa from 'koa';
import * as Router from '@koa/router';
import * as cors from '@koa/cors';
import * as bodyParser from 'koa-bodyparser';
import { StringSimilarityDataFetch } from '../StringSimilarityDataFetch';

const searchSimilarityByGroup: Record<string, StringSimilarityDataFetch> = {};
const getLoadedStringSimilarity = async (
    group: string,
): Promise<StringSimilarityDataFetch> => {
    if (!searchSimilarityByGroup[group]) {
        searchSimilarityByGroup[group] = new StringSimilarityDataFetch(group);
        await searchSimilarityByGroup[group].loadData();
    }

    return searchSimilarityByGroup[group];
};

export const registerRootRoute = (): void => {
    const app = new Koa();
    const router = new Router();

    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
        }
    });

    /**
     * get data by the string similarity
     * @returns {Object} keyData - the object that matches the search with the greatest similarity
     * @returns {string} keyData.key - the key of the object, which is used for the search similarity
     * @returns {number} keyData.similarity - double from 0 to 1, representing how similar the given string is to the key of this object
     * @returns {Object[]} keyData.data - the meaningful data associated with this object
     * @returns {string} keyData.data.name - the name of this data entry
     * @returns {string} keyData.data.value - the value of this data entry
     */
    router.get('/:group/:searchString', async (ctx, next) => {
        const { searchString, group } = ctx.params;

        if (typeof group !== 'string' && typeof searchString !== 'string') {
            ctx.status = 400;
            ctx.body = 'group or searchString params not given properly';
            return await next();
        }

        const searchSimilarity = await getLoadedStringSimilarity(group);

        const keyData = await searchSimilarity.getDataBySimilarity(
            searchString,
        );

        if (!keyData) {
            ctx.status = 404;
            ctx.body = 'An similar entry of the given string cannot be found';
            return await next();
        }

        ctx.body = keyData;

        await next();
    });

    /**
     * add a new entry
     * body should have the following
     * @returns {Object | Object[]} data - the data to be added must be in a "data" param in the body. It should either be an object or an array of objects
     * @returns {string} data.key - the key of the object, which is used for the search similarity
     * @returns {Object[]} data.data - the meaningful data associated with this object
     * @returns {string} data.data.name - the name of this data entry
     * @returns {string} data.data.value - the value of this data entry
     */
    router.post('/:group', async (ctx, next) => {
        const { data } = ctx.request.body;
        const { group } = ctx.params;

        if (typeof group !== 'string') {
            ctx.status = 400;
            ctx.body = 'group param not given properly';
            return await next();
        }

        const searchSimilarity = await getLoadedStringSimilarity(group);

        await searchSimilarity.addData(data);

        ctx.status = 204;

        await next();
    });

    /**
     * clears all data of this group, also removing them from the database
     */
    router.delete('/:group', async (ctx, next) => {
        const { group } = ctx.params;

        if (typeof group !== 'string') {
            ctx.status = 400;
            ctx.body = 'group param not given properly';
            return await next();
        }

        const searchSimilarity = await getLoadedStringSimilarity(group);

        await searchSimilarity.clearData();

        ctx.status = 204;

        await next();
    });

    app.use(bodyParser());
    app.use(router.routes()).use(router.allowedMethods());
    app.use(cors());

    app.listen(process.env.SERVER_PORT || 3000);
};
