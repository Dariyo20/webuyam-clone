// Augments Express's Request type so req.user is available after requireAuth.
// This file has no imports so TypeScript treats it as a global declaration.

declare namespace Express {
  interface Request {
    user?: {
      userId: string;
    };
  }
}
