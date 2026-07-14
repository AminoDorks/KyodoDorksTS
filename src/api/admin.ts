import { CommonResponseSchema, type CommonResponse } from '../dto/common.dto';
import type { Http } from '../client/http';
import type { BroadcastBuilder } from '../types/usable';

export class AdminAPI {
  private http: Http;
  private endpoint: string;

  constructor(http: Http, circleId: string) {
    this.http = http;
    this.endpoint = `/${circleId}/s`;
  }

  public broadcast = async (builder: BroadcastBuilder): Promise<CommonResponse> =>
    await this.http.post<CommonResponse>(
      {
        path: `${this.endpoint}/broadcast`,
        body: JSON.stringify(builder),
      },
      CommonResponseSchema
    );
}
