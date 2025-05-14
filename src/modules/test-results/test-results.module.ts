import { Module } from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { TestResultsController } from './test-results.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TestResult, TestResultSchema } from 'src/entities/test-result.entity';
import { TestResultRepository } from './test-results.repository';

@Module({
  imports: [MongooseModule.forFeature([{name: TestResult.name, schema: TestResultSchema}])],
  providers: [TestResultsService, TestResultRepository],
  controllers: [TestResultsController]
})
export class TestResultsModule {}
