import { IsString, IsNotEmpty } from 'class-validator';

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
  feedback?: 'like' | 'dislike' | 'report';
}
