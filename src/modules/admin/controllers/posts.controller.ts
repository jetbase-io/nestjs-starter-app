import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { PaginationParams } from '../dto/pagination-params.dto';
import { PaginationResponseDto } from '../dto/pagination-response.dto';
import { PostsService } from '../../../modules/posts/posts.service';
import { PostEntity } from '../../../modules/posts/models/posts.entity';
import { CreatePostDto } from '../../../modules/posts/dto/create-post-dto';
import { UpdatePostDto } from '../../../modules/posts/dto/update-post-dto';
import { SentryInterceptor } from '../../../modules/sentry/sentry.interceptor';

@ApiTags('Posts')
@UseInterceptors(SentryInterceptor)
@Controller('posts')
@UseGuards(AdminAuthGuard)
export class PostsController {
  constructor(private postService: PostsService) {}

  @ApiOperation({ summary: 'Get posts' })
  @ApiResponse({ status: 200, type: PostEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('')
  getPosts(
    @Query() query: PaginationParams,
  ): Promise<PaginationResponseDto<PostEntity>> {
    return this.postService.getAllPosts(query);
  }

  @ApiOperation({ summary: 'Get post' })
  @ApiResponse({ status: 200, type: PostEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  getOne(@Param('id') id: string): Promise<PostEntity> {
    return this.postService.getPostById(id);
  }

  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({ status: 200 })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createPost(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postService.createPost(createPostDto);
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200 })
  @UseInterceptors(ClassSerializerInterceptor)
  @Put('/:id')
  updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<UpdatePostDto> {
    return this.postService.updatePostById(id, updatePostDto);
  }

  @ApiOperation({ summary: 'Delete many posts' })
  @ApiResponse({ status: 200, description: 'Returns success message' })
  @Delete('delete')
  deleteMany(@Body() { ids }: any): Promise<{ message: string }> {
    return this.postService.deleteManyPosts(ids);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, description: 'Returns success message' })
  @Delete(':id')
  deleteOne(@Param('id') id: string): Promise<{ message: string }> {
    return this.postService.deletePostById(id);
  }
}
