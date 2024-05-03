import { createResult, createResults } from '@/common/dto/result.type';
import { CommentType } from './comment.type';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Page } from '@/common/dto/page.type';


@ObjectType()
export class CommentResult extends createResult(CommentType) {}

@ObjectType()
export class CommentResults extends createResults(CommentType) {}

@ObjectType()
export class createCommentResult {
    @Field(() => Number, { nullable: true })
    code: number;
    @Field(() => Boolean, { nullable: true })
    message: boolean;
}