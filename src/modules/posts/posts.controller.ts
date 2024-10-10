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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { PaginationParams } from '../admin/dto/pagination-params.dto';
import { PaginationResponseDto } from '../admin/dto/pagination-response.dto';
import { SentryInterceptor } from '../../common/interceptors/sentry.interceptor';
import { PostEntityDto } from './dto/post-entity-dto';
import { ApiOkResponsePaginated } from 'src/common/responses/successResponses';
import { UuidListParam, UuidParam } from 'src/common/params/uuid.param';
import { MessageResponse } from 'src/common/responses/messageResponse';

@ApiTags('Posts')
@UseInterceptors(SentryInterceptor)
@Controller('posts')
@ApiBearerAuth()
export class PostsController {
  constructor(private postService: PostsService) {}

  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({ type: PostEntityDto })
  @Post()
  createPost(@Body() createPostDto: CreatePostDto): Promise<PostEntityDto> {
    return this.postService.createPost(createPostDto);
  }

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
  @Get('/:id')
  getPostById(@Param() param: UuidParam): Promise<PostEntityDto> {
    return this.postService.getPostById(param.id);
  }

  @ApiOperation({ summary: 'Delete post by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns success message',
    type: MessageResponse,
  })
  @Delete('/:id')
  deletePostById(@Param() param: UuidParam): Promise<MessageResponse> {
    return this.postService.deletePostById(param.id);
  }

  @ApiOperation({ summary: 'Delete many posts' })
  @ApiResponse({
    status: 200,
    description: 'Returns success message',
    type: MessageResponse,
  })
  @Delete()
  deleteMany(@Body() body: UuidListParam): Promise<MessageResponse> {
    return this.postService.deleteManyPosts(body.ids);
  }

  @ApiOperation({ summary: 'Update post by id' })
  @ApiResponse({ status: 200, type: UpdatePostDto })
  @Put('/:id')
  updatePostById(
    @Param() param: UuidParam,
    @Body() body: UpdatePostDto,
  ): Promise<UpdatePostDto> {
    return this.postService.updatePostById(param.id, body);
  }
}
