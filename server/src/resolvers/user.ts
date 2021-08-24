import { User } from "../entities/User";
import argon2 from "argon2";
import { Arg, Mutation, Resolver } from "type-graphql";

@Resolver()
export class UserResolver {
  @Mutation((_returns) => User, { nullable: true })
  async register(
    @Arg("email") email: string,
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<User | null> {
    try {
      const existingUser = await User.findOne({
        where: [{ username }, { email }],
      });
      if (existingUser) return null;

      const hashPassword = await argon2.hash(password);

      const newUser = User.create({
        username,
        password: hashPassword,
        email,
      });

      return await User.save(newUser);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
