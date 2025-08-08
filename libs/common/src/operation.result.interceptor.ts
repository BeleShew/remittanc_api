import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OperationResult } from './operation.result.dto';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class OperationResultInterceptor<T> implements NestInterceptor<T, OperationResult<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<OperationResult<T>> {
        return next.handle().pipe(
            map((data: any) => {
                if (data && typeof data === 'object' && 'statusAPI' in data) {
                    return data;
                }
                return {
                    statusAPI: 'SUCCESS',
                    messageAPI: 'Operation successful',
                    data: data,
                };
            }),
        );
    }
}

@Catch()
export class OperationResultExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception.message || 'Internal server error';
        const errorCode = exception.code || exception.response?.errorCode || undefined;
        const errorList = Array.isArray(exception.response?.message)
            ? exception.response.message
            : [exception.response?.message || message];

        const result: OperationResult = {
            statusAPI: 'ERROR',
            messageAPI: message,
            errorCode,
            errorList,
        };
        response.status(status).json(result);
    }
}
