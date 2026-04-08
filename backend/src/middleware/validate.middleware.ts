import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Factory that returns an Express middleware validating req.body, req.params,
 * and req.query against the provided Zod schema.
 *
 * On failure → 400 with field-level details.
 * On success → passes control to the next handler.
 */
export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction): void => {
    schema
      .parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      })
      .then(() => next())
      .catch((error: unknown) => {
        if (error instanceof ZodError) {
          const details = error.errors.map((e) => ({
            // Drop the leading "body" / "params" / "query" segment for clarity
            field: e.path.slice(1).join('.'),
            message: e.message,
          }));

          res.status(400).json({
            success: false,
            error: {
              message: 'Validation failed',
              code: 'VALIDATION_ERROR',
              details,
            },
          });
          return;
        }

        next(error instanceof Error ? error : new Error(String(error)));
      });
  };
