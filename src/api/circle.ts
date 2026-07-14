import {
  ExploreResponseSchema,
  GetCircleResponseSchema,
  ManyCirclesResponseSchema,
  type ExploreResponse,
  type GetCircleResponse,
  type ManyCirclesResponse,
} from '../dto/circle.dto';
import type { Http } from '../client/http';
import type { Circle } from '../entities/circle';
import type { ExploreElement } from '../entities/explore-element';

export class CircleAPI {
  private http: Http;

  constructor(http: Http) {
    this.http = http;
  }

  private changeState = async (circleId: string, state: 'join' | 'leave'): Promise<Circle> =>
    (
      await this.http.post<GetCircleResponse>(
        { path: `/${circleId}/s/circles/${state}`, body: JSON.stringify({}) },
        GetCircleResponseSchema
      )
    ).circle;

  public get = async (circleId: string): Promise<Circle> =>
    (await this.http.get<GetCircleResponse>(`/${circleId}/s/circles`, GetCircleResponseSchema))
      .circle;

  public joined = async (): Promise<Circle[]> =>
    (await this.http.get<ManyCirclesResponse>(`/g/s/circles/joined`, ManyCirclesResponseSchema))
      .circleList;

  public explore = async (region: string = 'en'): Promise<ExploreElement[]> =>
    (await this.http.get<ExploreResponse>(`/g/s/explore/?region=${region}`, ExploreResponseSchema))
      .exploreModuleList;

  public join = async (circleId: string): Promise<Circle> =>
    await this.changeState(circleId, 'join');

  public leave = async (circleId: string): Promise<Circle> =>
    await this.changeState(circleId, 'leave');
}
