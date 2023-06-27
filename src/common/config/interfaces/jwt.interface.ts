export interface ISingleJwt {
  secret: string;
  time: string;
}

export interface IJwt {
  access: ISingleJwt;
  confirmation: ISingleJwt;
  resetPassword: ISingleJwt;
  refresh: ISingleJwt;
}

export interface IAccessTokenPayload {
  id: number;
}
