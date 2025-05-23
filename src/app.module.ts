import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { TestsModule } from './modules/tests/tests.module';
import { TestResultsModule } from './modules/test-results/test-results.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { AdminModule } from './modules/admin/admin.module';
import { AttachRoleMiddleware } from './middlewares/attach-user-role.middleware';
import { JwtService } from '@nestjs/jwt';

import mongooseConfig from './config/mongoose.config';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './modules/student/student.module';
import { CourseModule } from './modules/course/course.module';
import { GroupModule } from './modules/group/group.module';
import multerConfig from './config/multer.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongooseConfig, multerConfig],
    }),
    MongooseModule.forRootAsync(mongooseConfig.asProvider()),
    UserModule,
    QuestionsModule,
    TestsModule,
    TestResultsModule,
    TeachersModule,
    AdminModule,
    StudentModule,
    CourseModule,
    GroupModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AttachRoleMiddleware).forRoutes('*');
  }
}
