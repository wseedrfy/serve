import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * 评分实体类
 */
@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id:string

  @Column({
    comment: '评分',
    default: '',
  })
  score: string;

  @Column({
    comment: '评论',
    default: '',
  })
  comment: string;

  @Column({
    comment: '课程名字',
    default: '',
  })
  courseName: string;

  @Column({
    comment: '课程图片链接',
    default: '',
  })
  courseCoverUrl: string;

  @Column({
    comment: '机构Id',
    default: '',
  })
  orgId: string;

  @Column({
    comment: '创建日期',
    default: '',
  })
  createDate: string;

  @Column({
    comment: '学生Id',
    default: '',
  })
  studentId: string;

  @Column({
    comment: '学生名字',
    default: '',
  })
  studentName: string;
}
