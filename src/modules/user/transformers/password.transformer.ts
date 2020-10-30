import crypto from 'crypto';
import { ValueTransformer } from 'typeorm';

export class PasswordTransformer implements ValueTransformer {
  to(value) {
    if (!value) return null;
    return crypto.createHmac('sha256', value).digest('hex');
  }

  from(value) {
    return value;
  }
}
