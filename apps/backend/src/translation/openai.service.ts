import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;
  private cache: Map<string, any> = new Map();

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY not configured');
    }
    this.openai = new OpenAI({
      apiKey: apiKey || 'dummy-key',
    });
  }

  /**
   * Translate Chinese text to TSL gloss using GPT
   */
  async translateToGloss(text: string): Promise<string> {
    const cacheKey = `translate:${text}`;
    if (this.cache.has(cacheKey)) {
      this.logger.log('Cache hit for translation');
      return this.cache.get(cacheKey);
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a Taiwan Sign Language (TSL) expert. Convert Chinese text to TSL gloss notation.
TSL gloss uses uppercase words representing sign concepts, with special notations:
- Use uppercase for sign concepts
- Separate glosses with spaces
- Use INDEX for pointing
- Use CL: for classifiers
Example: "我喜歡吃飯" -> "INDEX-1 LIKE EAT RICE"
Only return the gloss, no explanation.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      });

      const gloss = completion.choices[0]?.message?.content?.trim() || '';
      this.cache.set(cacheKey, gloss);
      return gloss;
    } catch (error) {
      this.logger.error('Error translating to gloss', error);
      throw new Error('Failed to translate text to TSL gloss');
    }
  }

  /**
   * Generate sign language image using DALL-E
   */
  async generateSignImage(gloss: string): Promise<string> {
    const cacheKey = `image:${gloss}`;
    if (this.cache.has(cacheKey)) {
      this.logger.log('Cache hit for image generation');
      return this.cache.get(cacheKey);
    }

    try {
      const prompt = `Create an educational illustration showing Taiwan Sign Language (TSL) hand gestures for: "${gloss}". 
Style: Clean, professional diagram with clear hand positions on white background. Show multiple hand gestures in sequence if needed. 
Make it suitable for learning sign language.`;

      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      });

      const imageUrl = response.data[0]?.url || '';
      this.cache.set(cacheKey, imageUrl);
      return imageUrl;
    } catch (error) {
      this.logger.error('Error generating image', error);
      throw new Error('Failed to generate sign language image');
    }
  }

  /**
   * Clear cache (for testing or manual refresh)
   */
  clearCache(): void {
    this.cache.clear();
    this.logger.log('Cache cleared');
  }
}
