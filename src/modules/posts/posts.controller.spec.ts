import { Test, TestingModule } from '@nestjs/testing';
import { PaginationParams } from '../admin/dto/pagination-params.dto';
import { CreatePostDto } from './dto/create-post-dto';
import { UpdatePostDto } from './dto/update-post-dto';
import { PostEntity } from './models/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;

  const dto = {
    title: 'Title',
    description: 'Description',
    published_at: null,
  };

  const postList = {
    items: [
      {
        id: '4786d065-4d1d-4150-8937-8d83ac516aef',
        created_at: '2022-11-17T12:11:40.432Z',
        updated_at: '2022-11-17T12:11:40.432Z',
        internalComment: null,
        title: 'Fifth Post',
        description: 'First description of the Fifth post',
        published_at: null,
      },
      {
        id: '8125b51b-ca84-4864-86ca-eec6ad4395ca',
        created_at: '2022-11-18T09:44:03.392Z',
        updated_at: '2022-11-18T09:44:03.392Z',
        internalComment: null,
        title: 'Sixth Post',
        description: 'Description of the Sixth post',
        published_at: null,
      },
      {
        id: '92663221-01ca-4e31-9619-317c531ec3f9',
        created_at: '2022-11-17T12:12:56.611Z',
        updated_at: '2022-11-17T12:12:56.611Z',
        internalComment: null,
        title: 'Second Post',
        description: 'Description of the Second post',
        published_at: null,
      },
    ],
    count: 3,
  };

  const mockPostsService = {
    createPost: jest.fn(async (createPostDto: CreatePostDto) => {
      return Promise.resolve(PostEntity);
    }),
    getAllPosts: jest.fn(async (query: PaginationParams) => {
      return Promise.resolve(postList);
    }),
    getPostById: jest.fn(async (id: string) => {
      return Promise.resolve(PostEntity);
    }),
    deletePostById: jest.fn(async (id: string) => {
      return Promise.resolve({
        message: 'Post deleted successfully!',
      });
    }),
    deleteManyPosts: jest.fn(async (ids: string[]) => {
      return Promise.resolve({
        message: 'Post deleted successfully!',
      });
    }),
    updatePostById: jest.fn(
      async (id: string, updatePostDto: UpdatePostDto) => {
        return Promise.resolve(updatePostDto);
      },
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService],
      controllers: [PostsController],
    })
      .overrideProvider(PostsService)
      .useValue(mockPostsService)
      .compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a post', () => {
    const data = controller.createPost(dto);
    expect(data).toEqual(
      Promise.resolve({
        title: 'Title',
        description: 'Description',
        published_at: null,
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        internalComment: null,
      }),
    );
  });

  it('should get all posts', () => {
    const data = controller.getPosts({
      page: '0',
      limit: '100',
      sort: 'id',
      order: 'ASC',
    });
    expect(data).toEqual(Promise.resolve(postList));
  });

  it('should get post by id', () => {
    const data = controller.getPostById('92663221-01ca-4e31-9619-317c531ec3f9');
    expect(data).toEqual(
      Promise.resolve({
        title: expect.any(String),
        description: expect.any(String),
        published_at: null,
        id: expect.any(String),
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        internalComment: null,
      }),
    );
  });

  it('should delete post by id', () => {
    const data = controller.deletePostById(
      '92663221-01ca-4e31-9619-317c531ec3f9',
    );
    expect(data).toEqual(
      Promise.resolve({
        message: 'Post deleted successfully!',
      }),
    );
  });

  it('should delete many posts by ids', () => {
    const data = controller.deleteMany([
      '92663221-01ca-4e31-9619-317c531ec3f9',
      '8125b51b-ca84-4864-86ca-eec6ad4395ca',
    ]);
    expect(data).toEqual(
      Promise.resolve({
        message: 'Post deleted successfully!',
      }),
    );
  });

  it('should update post by id', () => {
    const data = controller.updatePostById(
      '92663221-01ca-4e31-9619-317c531ec3f9',
      {
        title: 'New title',
        description: 'New description',
        published_at: null,
      },
    );
    expect(data).toEqual(
      Promise.resolve({
        title: 'New title',
        description: 'New description',
        published_at: null,
      }),
    );
  });
});
