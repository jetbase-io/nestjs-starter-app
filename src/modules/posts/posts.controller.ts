import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post-dto';
import { PostEntity } from './models/posts.entity';
import { UpdatePostDto } from './dto/update-post-dto';
import { PaginationParams } from '../admin/dto/pagination-params.dto';
import { PaginationResponseDto } from '../admin/dto/pagination-response.dto';
import { SentryInterceptor } from '../sentry/sentry.interceptor';

@ApiTags('Posts')
@UseInterceptors(SentryInterceptor)
@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({ status: 200 })
  @Post()
  createPost(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postService.createPost(createPostDto);
  }

  @ApiOperation({ summary: 'Get posts' })
  @ApiResponse({ status: 200, type: PostEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getPosts(
    @Query() query: PaginationParams,
  ): Promise<PaginationResponseDto<PostEntity>> {
    return this.postService.getAllPosts(query);
  }

  @ApiOperation({ summary: 'Get post by id' })
  @ApiResponse({ status: 200 })
  @Get('/:id')
  getPostById(@Param('id') id: string): Promise<PostEntity> {
    return this.postService.getPostById(id);
  }

  @ApiOperation({ summary: 'Get post by id' })
  @ApiResponse({ status: 200 })
  @Delete('/:id')
  deletePostById(@Param('id') id: string): Promise<{ message: string }> {
    return this.postService.deletePostById(id);
  }

  @ApiOperation({ summary: 'Delete many posts' })
  @ApiResponse({ status: 200, description: 'Returns success message' })
  @Delete()
  deleteMany(@Body() { ids }: any): Promise<{ message: string }> {
    return this.postService.deleteManyPosts(ids);
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: PostEntity })
  @Put('/:id')
  updatePostById(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<UpdatePostDto> {
    return this.postService.updatePostById(id, updatePostDto);
  }
}
