import "reflect-metadata";
import { AuthChecker } from "type-graphql";

// export class AppAuthChecker implements AuthChecker<ContextType> {
//     // inject dependency
//     constructor(private readonly userRepository: Repository<User>) {}
  
//     check({ root, args, context, info }: ResolverData<ContextType>, roles: string[]) {
//       const userId = getUserIdFromToken(context.token);
//       // use injected service
//       const user = this.userRepository.getById(userId);
  
//       // custom logic here, e.g.:
//       return user % 2 === 0;
//     }
//   }
  