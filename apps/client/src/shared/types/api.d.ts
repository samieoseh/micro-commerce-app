export interface ApiResponse<T> {
  code: number;
  code_message: string;
  data: T;
}