import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ChoiceDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  isCorrect: boolean;
}

export class CreateAndAssignQuestionDto {
  @IsMongoId()
  quizId: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  choices: ChoiceDto[];

  points?: number;
  isMath?: boolean;
  isMultiTrue?: boolean;
}

export class AssignExistingQuestionsDto {
  @IsMongoId()
  quizId: string;

  @IsArray()
  @IsMongoId({ each: true })
  questionIds: string[];
}

export class BulkCreateQuestionsDto {
  @IsMongoId()
  quizId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBulkQuestionDto)
  questions: CreateBulkQuestionDto[];
}

class CreateBulkQuestionDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChoiceDto)
  choices: ChoiceDto[];

  points?: number;
  isMath?: boolean;
  isMultiTrue?: boolean;
}