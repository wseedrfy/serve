import { CommonType } from '@/common/dto/common.type';
import { OrganizationType } from '@/modules/organization/dto/organization.type';
import { ProductType } from '@/modules/product/dto/product.type';
import { StudentType } from '@/modules/student/dto/student.type';
import { WxorderType } from '@/modules/wxorder/dto/wxorder.type';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * 订单
 */
@ObjectType()
export class OrderType extends CommonType {
  @Field({ nullable: true })
  id: string;

  @Field({
    description: '数量',
  })
  quantity: number;

  @Field({
    description: 'amount',
  })
  amount: number;

  @Field({
    description: '手机号',
  })
  tel: string;

  @Field({
    description: '状态',
  })
  status: string;

  @Field({
    description: 'createdAt',
    nullable: true,
  })
  createdAt: Date;

  @Field({
    description: '订单号',
    nullable: true,
  })
  outTradeNo: string;

  @Field(() => StudentType, { nullable: true, description: '购买学员' })
  student?: StudentType;

  @Field({
    description: '学生id',
    nullable: true,
  })
  studentId: string;

  @Field(() => OrganizationType, { nullable: true, description: '机构' })
  org?: OrganizationType;

  @Field(() => ProductType, { nullable: true, description: '商品' })
  product?: ProductType;

  @Field({
    description: '商品id',
    nullable: true,
  })
  productId: string;

  @Field(() => WxorderType, { nullable: true, description: '微信订单信息' })
  wxOrder?: WxorderType;
}
