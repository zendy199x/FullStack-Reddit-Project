import {
  Arg,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware
} from "type-graphql";
import { Post } from "../entities/Post";
import { User } from "../entities/User";
import { CreatePostInput } from "../types/CreatePostInput";
import { PostMutationResponse } from "../types/PostMutationResponse";
import { UpdatePostInput } from "../types/UpdatePostInput";
import { checkAuth } from "./../middleware/checkAuth";
import { PaginatedPosts } from './../types/PaginatedPosts';

@Resolver((_of) => Post)
export class PostResolver {
  @FieldResolver((_return) => String)
  textSnippet(@Root() root: Post) {
    return root.text.slice(0, 50);
  }

  @FieldResolver((_return) => User)
  async user(@Root() root: Post) {
    return await User.findOne(root.userId);
  }

  @Mutation((_return) => PostMutationResponse)
  async createPost(
    @Arg("createPostInput") { title, text }: CreatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const newPost = Post.create({
        title,
        text,
      });

      await newPost.save();

      return {
        code: 200,
        success: true,
        message: "Post created successfully",
        post: newPost,
      };
    } catch (error) {
      console.log(error);
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  @Query((_return) => PaginatedPosts, { nullable: true })
  async posts(): Promise<PaginatedPosts | null> {
    try {
      const posts = await Post.find();
      return {
        totalCount: 5,
        cursor: new Date(),
        hasMore: true,
        paginatedPosts: posts,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Query((_return) => Post, { nullable: true })
  async post(@Arg("id", (_type) => ID) id: number): Promise<Post | undefined> {
    try {
      const post = await Post.findOne(id);
      return post;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async updatePost(
    @Arg("updatePostInput") { id, title, text }: UpdatePostInput
  ): Promise<PostMutationResponse> {
    const existingPost = await Post.findOne(id);

    if (!existingPost)
      return {
        code: 400,
        success: false,
        message: "Post not found",
      };

    existingPost.title = title;
    existingPost.text = text;

    await existingPost.save();

    return {
      code: 200,
      success: true,
      message: "Post updated successfully",
      post: existingPost,
    };
  }

  @Mutation((_return) => PostMutationResponse)
  @UseMiddleware(checkAuth)
  async deletePost(
    @Arg("id", (_type) => ID) id: number
  ): Promise<PostMutationResponse> {
    const existingPost = await Post.findOne(id);
    if (!existingPost)
      return {
        code: 400,
        success: false,
        message: "Post not found",
      };

    await Post.delete({ id });

    return {
      code: 200,
      success: true,
      message: "Post deleted successfully",
    };
  }
}
