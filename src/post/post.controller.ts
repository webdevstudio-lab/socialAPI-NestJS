import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { NewPostDto } from './dto/newPost.dto';
import { Request } from 'express';
import { UpdatePostDto } from './dto/updatePost.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('all')
  getAllPost() {
    return this.postService.getAllPost();
  }

  @Get('/:id')
  getOnePost(@Param('id', ParseIntPipe) postId: number) {
    return this.postService.getOnePost(postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('new-post')
  createPost(@Body() newPodtDto: NewPostDto, @Req() request: Request) {
    const userId = request.user['userid'];
    return this.postService.create(newPodtDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deletePost(
    @Param('id', ParseIntPipe) postId: number,
    @Req() request: Request,
  ) {
    const userId = request.user['userid'];
    return this.postService.deletePost(postId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  updatePost(
    @Param('id', ParseIntPipe) postId: number,
    @Body() upadePostDto: UpdatePostDto,
    @Req() request: Request,
  ) {
    const userId = request.user['userid'];
    return this.postService.updatePost(upadePostDto, postId, userId);
  }
}
