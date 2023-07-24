export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IGenerateTokens extends ITokens {
  hashedRefreshToken: string;
}
