export enum ApiError {
  Unknown = "Unknown",
  EmailExists = "EmailExists",
  InvalidCredentials = "InvalidCredentials",
  CourseNameExists = "CourseNameExists",
}

export type ApiResponse = {
  success: boolean;
  data: any;
};
