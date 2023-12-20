import { EHttpStatus } from '../constant/statusCode';

export type TServiceResponseBodyType<T = null> = { data: T; message?: string };
export type TServiceResponseType<T = null> = { statusCode: EHttpStatus } & TServiceResponseBodyType<T>;
export type TValidatorResponseBodyType<T> = { message?: string; data?: T };
