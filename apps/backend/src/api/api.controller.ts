import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('translate')
  async translate(@Body() body: { text: string }) {
    try {
      if (!body.text) {
        throw new HttpException('Text is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.apiService.translateToGloss(body.text);
      return result;
    } catch (error) {
      console.error('Error in translate endpoint:', error);
      throw new HttpException(
        error.message || 'Translation failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generate')
  async generate(@Body() body: { text: string; gloss: string }) {
    try {
      if (!body.text || !body.gloss) {
        throw new HttpException('Text and gloss are required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.apiService.generateSignLanguageImage(body.text, body.gloss);
      return result;
    } catch (error) {
      console.error('Error in generate endpoint:', error);
      throw new HttpException(
        error.message || 'Image generation failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('postprocess')
  async postprocess(@Body() body: { images: any[]; gloss: string }) {
    try {
      if (!body.images || !Array.isArray(body.images)) {
        throw new HttpException('Images array is required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.apiService.postprocessImages(body.images, body.gloss);
      return result;
    } catch (error) {
      console.error('Error in postprocess endpoint:', error);
      throw new HttpException(
        error.message || 'Postprocessing failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('feedback')
  async feedback(@Body() body: { imageId: string; type: string }) {
    try {
      if (!body.imageId || !body.type) {
        throw new HttpException('ImageId and type are required', HttpStatus.BAD_REQUEST);
      }

      const result = await this.apiService.saveFeedback(body.imageId, body.type);
      return result;
    } catch (error) {
      console.error('Error in feedback endpoint:', error);
      throw new HttpException(
        error.message || 'Feedback submission failed',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
