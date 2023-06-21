/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PredictRequest } from '../models/PredictRequest';
import type { PredictResponse } from '../models/PredictResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ModelService {

    /**
     * Predict
     * @param requestBody
     * @returns PredictResponse Successful Response
     * @throws ApiError
     */
    public static predictV1PredictPost(
        requestBody: PredictRequest,
    ): CancelablePromise<PredictResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/v1/predict',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
