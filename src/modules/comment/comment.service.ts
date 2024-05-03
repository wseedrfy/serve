/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, FindOptionsWhere } from 'typeorm';
import { Comment } from './models/comment.entity';
import { OrderStatus } from '@/common/constants/enmu';
import { promises } from 'dns';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(entity: DeepPartial<Comment>): Promise<boolean> {
    const res = await this.commentRepository.insert(entity)
    if (res) {
      return true;
    }
    return false;
  }

  async findByOrgId(orgId:string): Promise<Comment> {
    const res = await this.commentRepository.findOne({
      where: {
        orgId,
      }
    })
    return res;
  }

  async findComments({
    start,
    length,
    where,
  }: {
    start: number;
    length: number;
    where: FindOptionsWhere<Comment>;
  }): Promise<[Comment[], number]> {
    return this.commentRepository.findAndCount({
      take: length,
      skip: start,
      where,
    });
  }

}
