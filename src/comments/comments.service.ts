import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { NewComDto } from './dto/newCom.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  //CREATE NEW COMMENTN
  async newcomment(postId: number, userId: any, NewComDto: NewComDto) {
    const { content } = NewComDto;

    //On recupere le post a commenter
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) throw new ForbiddenException('This post no longer exsist!');

    // on commente le post
    const comment = await this.prismaService.comment.create({
      data: { postId, userId, content },
      include: {
        post: {
          select: {
            postId: true,
            title: true,
            body: false,
            user: false,
          },
        },
        user: {
          select: {
            email: true,
            password: false,
            username: true,
          },
        },
      },
    });

    return { message: 'comment posted successfully!', data: comment };
  }

  // DELETE A COMMENT
  async deleteCom(commentId: number, userId: number) {
    //**On verifie si le commentaire exist */
    const com = await this.prismaService.comment.findUnique({
      where: { commentId },
    });
    if (!com) {
      throw new ForbiddenException('This comment is no longer exsist!');
    }

    //**On verifice si l'utilisateur est bien l'auteur du comentaire */
    if (com.userId != userId)
      throw new UnauthorizedException('You can not delete this comment!');

    //**On delete le comment */
    await this.prismaService.comment.delete({ where: { commentId } });
    return { message: 'Comment was successfully deleted!' };
  }

  //UPDADE A COMMENT
  async updateCom(commentId: number, userId: any, updateComDto: NewComDto) {
    const { content } = updateComDto;

    //**On recupere le commentaire a modifier */
    const com = await this.prismaService.comment.findUnique({
      where: { commentId },
    });

    if (!com) return new ForbiddenException('Can not find this comment');

    //on verifie si l'utilisateur es bien l'auteur du commentaire

    if (com.userId != userId)
      throw new UnauthorizedException('You can not edit this comment!');

    //**On met a jour le commentaire */

    const updatecom = await this.prismaService.comment.update({
      where: { commentId },
      data: { content, userId },
      include: {
        post: {
          select: {
            postId: true,
            title: true,
            body: false,
            user: false,
          },
        },
        user: {
          select: {
            email: true,
            password: false,
            username: true,
          },
        },
      },
    });

    return { data: updatecom, message: 'Comment was successfully updated!' };
  }
}
