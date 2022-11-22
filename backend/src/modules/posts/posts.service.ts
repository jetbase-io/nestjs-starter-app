import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getSort } from 'src/utils/helpers/get-sort';
import { getRepository, Repository } from 'typeorm';
import { PaginationParams } from '../admin/dto/pagination-params.dto';
import { PaginationResponseDto } from '../admin/dto/pagination-response.dto';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { PostEntity } from './models/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
    const post = new PostEntity();
    post.title = createPostDto.title;
    post.description = createPostDto.description;
    post.published_at = createPostDto.pubslished_at;
    return await this.postRepository.save(post);
  }

  async getAllPosts(
    query: PaginationParams,
  ): Promise<PaginationResponseDto<PostEntity>> {
    const sort = getSort(query, 'posts');
    const data = await getRepository(PostEntity)
      .createQueryBuilder('posts')
      .take(+query.limit)
      .skip(+query.page)
      .orderBy(sort, query.order)
      .getManyAndCount();

    return {
      items: data[0],
      count: data[1],
    };
  }

  async getPostById(id: string): Promise<PostEntity> {
    await this.isPostExist(id);
    return await this.postRepository.findOne({ id });
  }

  async deletePostById(id: string): Promise<{ message: string }> {
    await this.isPostExist(id);
    await this.postRepository.delete(id);
    return {
      message: 'Post deleted successfully!',
    };
  }

  async deleteManyPosts(ids: string[]): Promise<{ message: string }> {
    await this.postRepository.delete(ids);
    return {
      message: 'Posts deleted successfully!',
    };
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
    const post = this.postRepository.findOne({ id });
    if (!post) {
      throw new BadRequestException({
        message: 'Post with provided id does not exist!',
      });
    }
    return true;
  }
}
