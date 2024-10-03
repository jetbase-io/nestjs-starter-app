import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getSort } from '../../utils/helpers/get-sort';
import { getRepository, Repository } from 'typeorm';
import { PaginationParams } from '../admin/dto/pagination-params.dto';
import { PaginationResponseDto } from '../admin/dto/pagination-response.dto';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { PostEntity } from './models/posts.entity';
import { PostEntityDto } from './dto/post-entity-dto';

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

    return PostEntityDto.fromEntity(result);
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

    return {
      items: data[0].map((item) => PostEntityDto.fromEntity(item)),
      count: data[1],
    };
  }

  async getPostById(id: string): Promise<PostEntityDto> {
    await this.isPostExist(id);
    const post = await this.postRepository.findOne({ id });

    return PostEntityDto.fromEntity(post);
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
    const post = await this.postRepository.findOne({ id });
    if (!post) {
      throw new BadRequestException({
        message: 'Post with provided id does not exist!',
      });
    }
    return true;
  }
}
