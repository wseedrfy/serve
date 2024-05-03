import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class OrderInput {

  @Field({
    description: '订单',
  })
  id: string;
  
  @Field({
    description: '商品id',
  })
  productId: string;

  @Field({
    description: '学生Id',
    nullable: true,
  })
  studentId: string;

  @Field({
    description: 'outTradeNo',
    nullable: true,
  })
  outTradeNo: string;

  @Field({
    description: '购买数量',
    nullable: true,
  })
  quantity: number;

  @Field({
    description: '实付款',
    nullable: true,
  })
  amount: number;

  @Field({
    description: '订单状态',
    nullable: true,
  })
  status: string;
}

@InputType()
export class PartialOrderInput extends PartialType(OrderInput) {}
