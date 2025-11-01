import { Test, TestingModule } from '@nestjs/testing';
import { TranslationService } from './translation.service';
import { OpenAIService } from './openai.service';

describe('TranslationService', () => {
  let service: TranslationService;
  let openaiService: OpenAIService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationService,
        {
          provide: OpenAIService,
          useValue: {
            translateToGloss: jest.fn().mockResolvedValue('INDEX-1 LIKE EAT'),
            generateSignImage: jest.fn().mockResolvedValue('http://example.com/image.png'),
          },
        },
      ],
    }).compile();

    service = module.get<TranslationService>(TranslationService);
    openaiService = module.get<OpenAIService>(OpenAIService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('translate', () => {
    it('should translate text to gloss', async () => {
      const result = await service.translate({ text: '我喜歡吃飯' });
      expect(result).toHaveProperty('gloss');
      expect(result.gloss).toBe('INDEX-1 LIKE EAT');
      expect(openaiService.translateToGloss).toHaveBeenCalledWith('我喜歡吃飯');
    });
  });

  describe('generate', () => {
    it('should generate image from gloss', async () => {
      const result = await service.generate({ gloss: 'INDEX-1 LIKE EAT' });
      expect(result).toHaveProperty('imageUrl');
      expect(result.imageUrl).toBe('http://example.com/image.png');
      expect(openaiService.generateSignImage).toHaveBeenCalledWith('INDEX-1 LIKE EAT');
    });
  });

  describe('processComplete', () => {
    it('should process complete translation', async () => {
      const result = await service.processComplete({ text: '我喜歡吃飯' });
      expect(result).toHaveProperty('originalText');
      expect(result).toHaveProperty('gloss');
      expect(result).toHaveProperty('imageUrl');
      expect(result).toHaveProperty('timestamp');
      expect(result.originalText).toBe('我喜歡吃飯');
      expect(result.gloss).toBe('INDEX-1 LIKE EAT');
    });
  });

  describe('postprocess', () => {
    it('should handle like feedback', async () => {
      const result = await service.postprocess({
        imageUrl: 'http://example.com/image.png',
        feedback: 'like',
      });
      expect(result.success).toBe(true);
      expect(result.message).toContain('positive feedback');
    });

    it('should handle dislike feedback', async () => {
      const result = await service.postprocess({
        imageUrl: 'http://example.com/image.png',
        feedback: 'dislike',
      });
      expect(result.success).toBe(true);
      expect(result.message).toContain('improve');
    });
  });
});
