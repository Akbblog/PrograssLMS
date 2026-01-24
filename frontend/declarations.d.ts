declare module '@hookform/resolvers/zod' {
  import { ZodSchema } from 'zod';
  import { Resolver } from 'react-hook-form';
  export const zodResolver: <TFieldValues extends Record<string, any> = any>(
    schema: ZodSchema<TFieldValues>,
    schemaOptions?: any,
    resolverOptions?: any
  ) => Resolver<TFieldValues>;
}
