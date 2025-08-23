import { ZodType } from 'zod';
import { ZodSchema } from 'zod/v3';
import BodyReadable from 'undici/types/readable';
import { Dispatcher, request } from 'undici';

import { HeadersType } from '../private';
import { BasicResponseSchema } from '../schemas/kyodo/basic';
import { LOGGER } from '../utils/logger';
import { BASE_API, ORIGIN_HEADERS } from '../constants';
import { generateXSig, generateXSignature } from '../utils/crypt';
import { DeleteRequestConfig, GetRequestConfig, PostRequestConfig } from '../schemas/httpworkflow';

export class HttpWorkflow {
    private __headers: HeadersType = ORIGIN_HEADERS;

    set headers(headers: HeadersType) {
        this.__headers = {
            ...this.__headers,
            ...headers
        };
    };

    private __mergeHeaders = (contentType?: string): HeadersType => {
        const mergedHeaders = JSON.parse(JSON.stringify(this.__headers));
        
        mergedHeaders['x-signature'] = generateXSignature();
        mergedHeaders['start-time'] = Date.now().toString();
        if (contentType) mergedHeaders['Content-Type'] = contentType;

        return mergedHeaders;
    };

    private __prepareHeaders = (body: string, contentType?: string): HeadersType => {
        const headers = this.__mergeHeaders(contentType);

        headers['Content-Length'] = body.length.toString();

        return headers;
    };

    private __xSigHeaders = (body: string, contentType?: string): HeadersType => {
        const preparedHeaders = this.__prepareHeaders(body, contentType);

        preparedHeaders['x-sig'] = generateXSig({
            startTime: preparedHeaders['start-time'],
            uid: preparedHeaders['uid'],
            deviceId: preparedHeaders['device-id'],
            data: body
        });

        return preparedHeaders;
    };

    private __handleResponse = async <T>(path: string, body: BodyReadable & Dispatcher.BodyMixin, schema: ZodSchema): Promise<T> => {
        const rawBody = await body.text();
        
        const responseSchema = BasicResponseSchema.parse(rawBody);
        LOGGER.child({ path: `${BASE_API}${path}` }).info(responseSchema.message);

        return schema.parse(rawBody) as T;
    };

    public sendGet = async <T extends ZodType>(config: GetRequestConfig, schema: ZodSchema): Promise<T> => {
        const { body } = await request(`${BASE_API}${config.path}`, {
            method: 'GET',
            headers: this.__mergeHeaders(config.contentType)
        });

        return this.__handleResponse(config.path, body, schema);
    };

    public sendDelete = async <T extends ZodType>(config: DeleteRequestConfig, schema: ZodSchema): Promise<T> => {
        const { body } = await request(`${BASE_API}${config.path}`, {
            method: 'DELETE',
            headers: this.__mergeHeaders()
        });

        return this.__handleResponse(config.path, body, schema);
    };

    public sendPost = async <T extends ZodType>(config: PostRequestConfig, schema: ZodSchema): Promise<T> => {
        const { body } = await request(`${BASE_API}${config.path}`, {
            method: 'POST',
            headers: this.__prepareHeaders(config.body, config.contentType),
            body: config.body
        });

        return this.__handleResponse(config.path, body, schema);
    };

    public sendXSigPost = async <T extends ZodType>(config: PostRequestConfig, schema: ZodSchema): Promise<T> => {
        const { body } = await request(`${BASE_API}${config.path}`, {
            method: 'POST',
            headers: this.__xSigHeaders(config.body, config.contentType),
            body: config.body
        });

        return this.__handleResponse(config.path, body, schema);
    };

    // TODO: make sendBuffer
};