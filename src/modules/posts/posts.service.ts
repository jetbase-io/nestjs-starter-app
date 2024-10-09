import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getSort } from '../../utils/helpers/get-sort';
import { getRepository, Repository } from 'typeorm';
import { PaginationParams } from '../admin/dto/pagination-params.dto';
import { PaginationResponseDto } from '../admin/dto/pagination-response.dto';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { PostEntity } from './models/posts.entity';
import {
  PaginatedPostsResponseDto,
  PostEntityDto,
} from './dto/post-entity-dto';
import { MessageResponse } from 'src/common/responses/messageResponse';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<PostEntityDto> {
    const post = new PostEntity();
    post.title = createPostDto.title;
    post.description = createPostDto.description;
    post.published_at = createPostDto.pubslished_at;
    const result = await this.postRepository.save(post);

    return PostEntityDto.invoke(result);
  }

  async getAllPosts(
    query: PaginationParams,
  ): Promise<PaginationResponseDto<PostEntityDto>> {
    const sort = getSort(query, 'posts');
    const data = await getRepository(PostEntity)
      .createQueryBuilder('posts')
      .take(+query.limit)
      .skip(+query.page)
      .orderBy(sort, query.order)
      .getManyAndCount();

    return PaginatedPostsResponseDto.invoke(data);
  }

  async getPostById(id: string): Promise<PostEntityDto> {
    await this.isPostExist(id);
    const post = await this.postRepository.findOne({ id });

    return PostEntityDto.invoke(post);
  }

  async deletePostById(id: string): Promise<MessageResponse> {
    await this.isPostExist(id);
    await this.postRepository.delete(id);

    const message = 'Post deleted successfully!';
    return MessageResponse.invoke(message);
  }

  async deleteManyPosts(ids: string[]): Promise<MessageResponse> {
    await this.postRepository.delete(ids);

    const message = 'Posts deleted successfully!';
    return MessageResponse.invoke(message);
  }

  async updatePostById(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<UpdatePostDto> {
    await this.isPostExist(id);
    await this.postRepository.update(id, updatePostDto);
    return updatePostDto;
  }

  async isPostExist(id: string): Promise<boolean> {
    const post = await this.postRepository.findOne({ id });
    if (!post) {
      throw new BadRequestException({
        message: 'Post with provided id does not exist!',
      });
    }
    return true;
  }
}
