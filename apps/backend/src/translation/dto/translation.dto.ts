import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class TranslateDto {
  @IsString()
  @IsNotEmpty()
  text: string;
}

export class GenerateImageDto {
  @IsString()
  @IsNotEmpty()
  gloss: string;
}

export class PostprocessDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsOptional()
  @IsIn(['like', 'dislike', 'report'])
  feedback?: 'like' | 'dislike' | 'report';
}
