import { Module } from '@nestjs/common';
import { TranslationController } from './translation.controller';
import { TranslationService } from './translation.service';
import { OpenAIService } from './openai.service';

@Module({
  controllers: [TranslationController],
  providers: [TranslationService, OpenAIService],
})
export class TranslationModule {}
