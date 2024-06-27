import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { NewPostDto } from './dto/newPost.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  //AFFICHER TOUTES LES PUBLICATION
  async getAllPost() {
    const posts = await this.prismaService.post.findMany({
      include: {
        user: {
          select: {
            password: false,
            email: true,
            username: true,
          },
        },
        comment: {
          select: {
            content: true,
            user: {
              select: {
                userid: true,
                username: true,
                email: true,
                password: false,
              },
            },
          },
        },
      },
    });
    if (posts.length <= 0) return { message: 'No Post on Databas' };

    return {
      data: posts,
    };
  }

  //AFFICHER UNE SEULE PUBLICATION
  async getOnePost(postId: number) {
    const post = await this.prismaService.post.findUnique({
      where: { postId },
      include: {
        user: {
          select: {
            password: false,
            email: true,
            username: true,
          },
        },
        comment: {
          select: {
            content: true,
            user: {
              select: {
                userid: true,
                username: true,
                email: true,
                password: false,
              },
            },
          },
        },
      },
    });
    if (!post) throw new ForbiddenException('This post no longer exsist!');

    return {
      data: post,
    };
  }

  //CREATION D'UN NOUVEAU POSTE
  async create(newPodtDto: NewPostDto, userId: number) {
    const { title, body } = newPodtDto;
    const post = await this.prismaService.post.create({
      data: { body, title, userId },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            password: false,
          },
        },
      },
    });

    return {
      message: 'Post was successfully created!',
      data: post,
    };
  }

  //SUPPRIMER UN PUBLICATION
  async deletePost(postId: number, userId: number) {
    //**On verirfie si le poste exsite */
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) throw new ForbiddenException('This post no longer exsist!');

    //**On verifie si l'utilisateur est l'auteur du post */
    if (post.userId != userId)
      return new UnauthorizedException('You can not delete this post!');

    //**On supprime le Post */
    await this.prismaService.post.delete({ where: { postId, userId } });

    return { message: 'Post was successfully deleted' };
  }

  //MODIFIER UN POST
  async updatePost(upadePostDto: UpdatePostDto, postId: number, userId: any) {
    const { title, body } = upadePostDto;
    //**On verirfie si le poste exsite */
    const post = await this.prismaService.post.findUnique({
      where: { postId },
    });
    if (!post) throw new ForbiddenException('This post no longer exsist!');

    //**On verifie si l'utilisateur est l'auteur du post */
    if (post.userId != userId)
      return new UnauthorizedException('You can not delete this post!');

    //**On met a jour le post */
    const upPost = await this.prismaService.post.update({
      where: { postId },
      data: {
        title,
        body,
      },
      include: {
        user: {
          select: {
            email: true,
            username: true,
            password: false,
          },
        },
        comment: {
          select: {
            content: true,
            user: {
              select: {
                userid: true,
                username: true,
                password: false,
              },
            },
          },
        },
      },
    });
    return { message: 'This post was successfully updated!', data: upPost };
  }
}
