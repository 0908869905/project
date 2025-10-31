import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ApiService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private cacheService: CacheService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      console.warn('⚠️  OPENAI_API_KEY not configured. Using mock mode.');
    }
    this.openai = new OpenAI({
      apiKey: apiKey || 'mock-key',
    });
  }

  async translateToGloss(text: string): Promise<{ gloss: string; originalText: string }> {
    const cacheKey = `gloss:${text}`;
    const cached = this.cacheService.get<{ gloss: string; originalText: string }>(cacheKey);
    
    if (cached) {
      console.log('✅ Cache hit for gloss translation');
      return cached;
    }

    try {
      // Use OpenAI to convert Chinese text to TSL gloss notation
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are an expert in Taiwan Sign Language (TSL). Convert Chinese text to TSL gloss notation.
TSL gloss uses uppercase words representing signs, with linguistic markers like IX (index), CL (classifier), etc.
Example: "我愛你" -> "IX-ME LOVE IX-YOU"`,
          },
          {
            role: 'user',
            content: `Convert this Chinese text to TSL gloss notation: "${text}"`,
          },
        ],
        max_tokens: 150,
        temperature: 0.3,
      });

      const gloss = completion.choices[0]?.message?.content?.trim() || text.toUpperCase();
      const result = { gloss, originalText: text };
      
      this.cacheService.set(cacheKey, result, 86400000); // 24 hours
      return result;

    } catch (error) {
      console.error('Error translating to gloss:', error);
      // Fallback: simple uppercase conversion
      return {
        gloss: text.split('').join(' ').toUpperCase(),
        originalText: text,
      };
    }
  }

  async generateSignLanguageImage(text: string, gloss: string): Promise<{ images: any[] }> {
    const cacheKey = `image:${gloss}`;
    const cached = this.cacheService.get<{ images: any[] }>(cacheKey);
    
    if (cached) {
      console.log('✅ Cache hit for image generation');
      return cached;
    }

    try {
      const prompt = `Create a clear, professional illustration of Taiwan Sign Language (TSL) hand gesture for: "${text}". 
The image should show:
- A clear hand gesture against a white background
- Professional, educational style
- Front view of the hand sign
- Clean, simple composition
The gesture represents the TSL gloss: ${gloss}`;

      const response = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      });

      const images = response.data.map((img, index) => ({
        id: `${Date.now()}-${index}`,
        url: img.url,
        gloss: gloss,
        timestamp: Date.now(),
      }));

      const result = { images };
      this.cacheService.set(cacheKey, result, 3600000); // 1 hour
      return result;

    } catch (error) {
      console.error('Error generating images:', error);
      // Return mock data in case of error
      return {
        images: [{
          id: `mock-${Date.now()}`,
          url: `https://via.placeholder.com/512?text=${encodeURIComponent(gloss)}`,
          gloss: gloss,
          timestamp: Date.now(),
        }],
      };
    }
  }

  async postprocessImages(images: any[], gloss: string): Promise<{ images: any[] }> {
    // In a production system, this could:
    // - Apply image filters
    // - Add watermarks
    // - Resize images
    // - Add metadata
    // For MVP, we'll just return the images with enhanced metadata

    const processedImages = images.map(img => ({
      ...img,
      processed: true,
      metadata: {
        gloss: gloss,
        processedAt: new Date().toISOString(),
        version: '1.0',
      },
    }));

    return { images: processedImages };
  }

  async saveFeedback(imageId: string, feedbackType: string): Promise<{ success: boolean }> {
    // In production, save to database
    // For MVP, just log it
    console.log(`📝 Feedback received: ${feedbackType} for image ${imageId}`);
    
    return { success: true };
  }
}
