import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { TranslateDto, GenerateImageDto, PostprocessDto } from './dto/translation.dto';

export interface TranslationResult {
  originalText: string;
  gloss: string;
  imageUrl: string;
  timestamp: string;
}

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);
  private feedbackLog: PostprocessDto[] = [];

  constructor(private openaiService: OpenAIService) {}

  /**
   * Translate Chinese text to TSL gloss
   */
  async translate(dto: TranslateDto): Promise<{ gloss: string }> {
    this.logger.log(`Translating text: ${dto.text}`);
    const gloss = await this.openaiService.translateToGloss(dto.text);
    return { gloss };
  }

  /**
   * Generate sign language image from gloss
   */
  async generate(dto: GenerateImageDto): Promise<{ imageUrl: string }> {
    this.logger.log(`Generating image for gloss: ${dto.gloss}`);
    const imageUrl = await this.openaiService.generateSignImage(dto.gloss);
    return { imageUrl };
  }

  /**
   * Process complete translation: text -> gloss -> image
   */
  async processComplete(dto: TranslateDto): Promise<TranslationResult> {
    this.logger.log(`Processing complete translation for: ${dto.text}`);
    
    // Step 1: Translate to gloss
    const gloss = await this.openaiService.translateToGloss(dto.text);
    
    // Step 2: Generate image
    const imageUrl = await this.openaiService.generateSignImage(gloss);
    
    return {
      originalText: dto.text,
      gloss,
      imageUrl,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Postprocess: Handle feedback and logging
   */
  async postprocess(dto: PostprocessDto): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Postprocessing with feedback: ${dto.feedback}`);
    
    this.feedbackLog.push({
      ...dto,
      feedback: dto.feedback,
    });

    let message = 'Feedback recorded successfully';
    if (dto.feedback === 'like') {
      message = 'Thank you for your positive feedback!';
    } else if (dto.feedback === 'dislike') {
      message = 'Thank you for your feedback. We will improve.';
    } else if (dto.feedback === 'report') {
      message = 'Issue reported. We will review it.';
    }

    return { success: true, message };
  }

  /**
   * Get feedback statistics (for monitoring)
   */
  getFeedbackStats() {
    const stats = {
      total: this.feedbackLog.length,
      likes: this.feedbackLog.filter(f => f.feedback === 'like').length,
      dislikes: this.feedbackLog.filter(f => f.feedback === 'dislike').length,
      reports: this.feedbackLog.filter(f => f.feedback === 'report').length,
    };
    return stats;
  }
}
