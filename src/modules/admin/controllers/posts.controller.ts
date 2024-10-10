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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { PaginationParams } from '../dto/pagination-params.dto';
import { PaginationResponseDto } from '../dto/pagination-response.dto';
import { PostsService } from '../../../modules/posts/posts.service';
import { CreatePostDto } from '../../../modules/posts/dto/create-post-dto';
import { UpdatePostDto } from '../../../modules/posts/dto/update-post-dto';
import { SentryInterceptor } from '../../../common/interceptors/sentry.interceptor';
import { ApiOkResponsePaginated } from 'src/common/responses/successResponses';
import { PostEntityDto } from 'src/modules/posts/dto/post-entity-dto';
import { UuidListParam, UuidParam } from 'src/common/params/uuid.param';
import { MessageResponse } from 'src/common/responses/messageResponse';

@ApiTags('Posts')
@UseInterceptors(SentryInterceptor)
@Controller('posts')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth()
export class PostsController {
  constructor(private postService: PostsService) {}

  @ApiOperation({ summary: 'Get posts' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOkResponsePaginated(PostEntityDto)
  getPosts(
    @Query() query: PaginationParams,
  ): Promise<PaginationResponseDto<PostEntityDto>> {
    return this.postService.getAllPosts(query);
  }

  @ApiOperation({ summary: 'Get post by id' })
  @ApiResponse({ type: PostEntityDto })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/:id')
  getOne(@Param() param: UuidParam): Promise<PostEntityDto> {
    return this.postService.getPostById(param.id);
  }

  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({ type: PostEntityDto })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createPost(@Body() createPostDto: CreatePostDto): Promise<PostEntityDto> {
    return this.postService.createPost(createPostDto);
  }

  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, type: UpdatePostDto })
  @UseInterceptors(ClassSerializerInterceptor)
  @Put('/:id')
  updatePost(
    @Param() param: UuidParam,
    @Body() body: UpdatePostDto,
  ): Promise<UpdatePostDto> {
    return this.postService.updatePostById(param.id, body);
  }

  @ApiOperation({ summary: 'Delete many posts' })
  @ApiResponse({
    status: 200,
    description: 'Returns success message',
    type: MessageResponse,
  })
  @Delete('delete')
  deleteMany(@Body() body: UuidListParam): Promise<MessageResponse> {
    return this.postService.deleteManyPosts(body.ids);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({
    status: 200,
    description: 'Returns success message',
    type: MessageResponse,
  })
  @Delete('/:id')
  deleteOne(@Param() param: UuidParam): Promise<MessageResponse> {
    return this.postService.deletePostById(param.id);
  }
}
