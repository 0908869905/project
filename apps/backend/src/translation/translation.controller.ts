import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslateDto, GenerateImageDto, PostprocessDto } from './dto/translation.dto';

@Controller('api')
export class TranslationController {
  private readonly logger = new Logger(TranslationController.name);

  constructor(private readonly translationService: TranslationService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Post('translate')
  async translate(@Body() dto: TranslateDto) {
    this.logger.log(`POST /api/translate - text: ${dto.text}`);
    return this.translationService.translate(dto);
  }

  @Post('generate')
  async generate(@Body() dto: GenerateImageDto) {
    this.logger.log(`POST /api/generate - gloss: ${dto.gloss}`);
    return this.translationService.generate(dto);
  }

  @Post('translate-complete')
  async translateComplete(@Body() dto: TranslateDto) {
    this.logger.log(`POST /api/translate-complete - text: ${dto.text}`);
    return this.translationService.processComplete(dto);
  }

  @Post('postprocess')
  async postprocess(@Body() dto: PostprocessDto) {
    this.logger.log(`POST /api/postprocess - feedback: ${dto.feedback}`);
    return this.translationService.postprocess(dto);
  }

  @Get('stats')
  getStats() {
    return this.translationService.getFeedbackStats();
  }
}
