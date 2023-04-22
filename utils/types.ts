export enum ApiError {
  Unknown = "Unknown",
  EmailExists = "EmailExists",
  InvalidCredentials = "InvalidCredentials",
}

export type ApiResponse = {
  success: boolean;
  data: any;
};
