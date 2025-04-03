import { CustomRequest } from '../middlewares/TokenVerification';
import { User, UserType } from '../entity/User';

export const getAuthenticatedUser = (req: CustomRequest): User | null => {
  return req.user || null;
};

export const checkIsAdmin = (req: CustomRequest): boolean | null => {
  const authenticatedUser = getAuthenticatedUser(req);
  console.log(authenticatedUser);
  return authenticatedUser && authenticatedUser.user_type === UserType.Admin;
};
