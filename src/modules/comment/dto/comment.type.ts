import { Field, ObjectType } from '@nestjs/graphql';

/**
 * 评分表类型
 */
@ObjectType()
export class CommentType {

  @Field({ nullable: true })
  id: string;

  @Field({
    description: '评分',
  })
  score: string;

  @Field({
    description: '评论',
  })
  comment: string;

  @Field({
    description: '课程名字',
    nullable: true,
  })
  courseName: string;

  @Field({
    description: '课程图片链接',
    nullable: true,
  })
  courseCoverUrl: string;

  @Field({
    description: '机构Id',
  })
  orgId: string;

  @Field({
    description: '创建日期',
    nullable: true,
  })
  createDate: string;

  @Field({
    description: '学生Id',
  })
  studentId: string;

  @Field({
    description: '学生名字',
    nullable: true,
  })
  studentName: string;

}
