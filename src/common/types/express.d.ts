// types/express.d.ts
import { UserType } from '../../entities/enums/user-type.enum'; // Adjust path as needed

declare global {
  namespace Express {
    interface Request {
      role?: UserType;
      userId?: String;
      email?: String;
    }
  }
}
