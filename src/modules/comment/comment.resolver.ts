/* eslint-disable */
import { FindOptionsWhere } from 'typeorm';
import { Comment } from './models/comment.entity';
import {
  COURSE_DEL_FAIL,
  COURSE_NOT_EXIST,
  CREATE_COMMENT_ERROR,
  ORDER_NOT_EXIST,
  ORDER_UPDATE_FAIL,
  PRODUCT_NOT_EXIST,
  PRODUCT_UPDATE_FAIL,
} from '../../common/constants/code';
import { Result } from '@/common/dto/result.type';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { SUCCESS } from '@/common/constants/code';
import { CommentResult, CommentResults, createCommentResult } from './dto/result-order.output';
import { OrderType } from './dto/order.type';
import { CommentService } from './comment.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { PageInput } from '@/common/dto/page.input';
import { CurOrgId } from '@/common/decorators/current-org.decorator';
import { PartialCommentInput } from './comment.input';
import { CommentType } from './dto/comment.type';

@Resolver()
@UseGuards(GqlAuthGuard)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  // 增接口  测试成功
  @Mutation(() => createCommentResult)  
  async createComment(
    @Args('params') params: PartialCommentInput,
  ): Promise<createCommentResult> {
    
    let res = await this.commentService.create(params)
    if (res){
      let newRes = {
        code: SUCCESS,
        message: true
      }
      return newRes
    }else{
      let newRes = {
        code: CREATE_COMMENT_ERROR,
        message: false
      }
      return newRes
    }
  }

  

  // //删接口
  // @Mutation(() => Result)

  // //改接口
  // @Mutation(() => OrderResults)

  // 查接口 测试成功
  @Query(() => CommentResults)  
  async getCommentsByOrgId(
    @Args('page') page: PageInput,
    @Args('orgId') orgId: string,
  ): Promise<CommentResults> {

    // const results = await this.commentService.findByOrgId(orgId)

    const { pageNum, pageSize } = page;
    //按照orgId来筛选订单
    const where: FindOptionsWhere<Comment> = { orgId: orgId };
    //where没问题啊
    console.log("where",where);
    console.log("看page",{
      pageNum,
      pageSize
    });
    
    const [results, total] = await this.commentService.findComments({
      start: (pageNum - 1) * pageSize,
      length: pageSize,
      where,
    });

    
    const res = {
      code: SUCCESS,
      page: {
        pageNum,
        pageSize,
        total,
      },
      message: '获取成功',
      data: results,
    };

    console.log("看niubi",res);

    return res
  }


}
