export class OperationResult<T = any> {
  statusAPI?: string;
  messageAPI?: string;
  message?: string;
  errorCode?: string;
  isSessionExpire?: boolean = false;
  errorList?: string[];
  conversationId?: string;
  sessionId?: string;
  messageId?: string;
  data?: T;
}