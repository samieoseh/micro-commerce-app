export interface SigninResponse {
  success: boolean;
  data: {
    accessToken: string;
    id: string;
    refreshToken: string;
  };
}

export interface SignupResponse {
  success: boolean;
  data: {
    accessToken: string;
    id: string;
    refreshToken: string;
  };
}