/* eslint-disable */
import { FindOptionsWhere } from 'typeorm';
import { Order } from './models/order.entity';
import {
  COURSE_DEL_FAIL,
  COURSE_NOT_EXIST,
  ORDER_NOT_EXIST,
  ORDER_UPDATE_FAIL,
  PRODUCT_NOT_EXIST,
  PRODUCT_UPDATE_FAIL,
} from './../../common/constants/code';
import { Result } from '@/common/dto/result.type';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/common/guards/auth.guard';
import { SUCCESS } from '@/common/constants/code';
import { OrderResult, OrderResults } from './dto/result-order.output';
import { OrderType } from './dto/order.type';
import { OrderService } from './order.service';
import { CurUserId } from '@/common/decorators/current-user.decorator';
import { PageInput } from '@/common/dto/page.input';
import { CurOrgId } from '@/common/decorators/current-org.decorator';
import { PartialOrderInput } from './order.input';

@Resolver(() => OrderType)
@UseGuards(GqlAuthGuard)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => OrderResult)
  async getOrderInfo(@Args('id') id: string): Promise<OrderResult> {
    const result = await this.orderService.findById(id);
    if (result) {
      return {
        code: SUCCESS,
        data: result,
        message: '获取成功',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: '订单信息不存在',
    };
  }

  @Query(() => OrderResults)
  async getOrders(
    @Args('page') page: PageInput,
    @CurOrgId() orgId: string,
  ): Promise<OrderResults> {
    const { pageNum, pageSize } = page;
    //按照orgId来筛选订单
    const where: FindOptionsWhere<Order> = { orgId: orgId };
    //where没问题啊
    console.log("where",where);
    console.log("看page",{
      pageNum,
      pageSize
    });
    
    const [results, total] = await this.orderService.findOrders({
      start: (pageNum - 1) * pageSize,
      length: pageSize,
      where,
    });

    
    const niubi = {
      code: SUCCESS,
      page: {
        pageNum,
        pageSize,
        total,
      },
      message: '获取成功',
      data: results,
    };

    console.log("看niubi",niubi);

    return niubi
  }

  @Mutation(() => Result)
  async deleteOrder(
    @Args('id') id: string,
    @CurUserId() userId: string,
  ): Promise<Result> {
    const result = await this.orderService.findById(id);
    if (result) {
      const delRes = await this.orderService.deleteById(id, userId);
      if (delRes) {
        return {
          code: SUCCESS,
          message: '删除成功',
        };
      }
      return {
        code: COURSE_DEL_FAIL,
        message: '删除失败',
      };
    }
    return {
      code: COURSE_NOT_EXIST,
      message: '门店信息不存在',
    };
  }


  @Mutation(() => OrderResults)
  async commitOrderInfo(
    @Args('params') params: PartialOrderInput,
    @CurUserId() userId: string,
    @CurOrgId() orgId: string,
    @Args('id', { nullable: true }) id: string,
  ): Promise<Result> {
    const order = await this.orderService.findById(id);
    if (order) {
      const newOrder = {
        ...params,
        updatedBy: userId,
      };
      const res = await this.orderService.updateById(order.id, newOrder);
      if (res) {
        return {
          code: SUCCESS,
          message: '更新成功',
        };
      }
      return {
        code: ORDER_UPDATE_FAIL,
        message: '更新失败',
      };
    }
    return {
      code: ORDER_NOT_EXIST,
      message: '商品信息不存在',
    };
  }

}
