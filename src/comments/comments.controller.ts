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
import { CommentsService } from './comments.service';
import { NewComDto } from './dto/newCom.dto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('post/:Postid')
  newComment(
    @Param('Postid', ParseIntPipe) postId: number,
    @Body() newComDto: NewComDto,
    @Req() request: Request,
  ) {
    const userId = request.user['userid'];
    return this.commentsService.newcomment(postId, userId, newComDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/:Comid')
  deleteCom(
    @Param('Comid', ParseIntPipe) commentId: number,
    @Req() request: Request,
  ) {
    const userId = request.user['userid'];
    return this.commentsService.deleteCom(commentId, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/update/:Comid')
  updateCom(
    @Param('Comid', ParseIntPipe) commentId: number,
    @Req() request: Request,
    @Body() updateComDto: NewComDto,
  ) {
    const userId = request.user['userid'];
    return this.commentsService.updateCom(commentId, userId, updateComDto);
  }
}
