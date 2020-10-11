import { plainToClass } from 'class-transformer';

export function classTransformToDto(dtoClass) {
  return function(target): void {
    for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
      const descriptor = Object.getOwnPropertyDescriptor(
        target.prototype,
        propertyName,
      );
      const isMethod = descriptor.value instanceof Function;
      if (!isMethod) continue;

      const originalMethod = descriptor.value;
      descriptor.value = async function(...args: any[]) {
        const result = await originalMethod.apply(this, args);
        if (!result) return;

        return plainToClass(dtoClass, result);
      };

      Object.defineProperty(target.prototype, propertyName, descriptor);
    }
  };
}

export function methodTransformToDto(
  dtoClass,
  isPaginatedResponse = false,
): any {
  return function(
    target: any,
    key: string,
    descriptor: TypedPropertyDescriptor<any>,
  ): TypedPropertyDescriptor<any> {
    const originalMethod = descriptor.value;

    descriptor.value = async function(this: any, ...args: any[]) {
      const result = await originalMethod.apply(this, args);
      if (!result) return;

      if (!isPaginatedResponse) return plainToClass(dtoClass, result);

      return {
        ...result,
        results: plainToClass(dtoClass, result.results),
      };
    };
    return descriptor;
  };
}
