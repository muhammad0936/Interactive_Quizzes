import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { TestsModule } from './modules/tests/tests.module';
import { GroupsModule } from './modules/groups/groups.module';
import { StudentsModule } from './modules/students/students.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { TestResultsModule } from './modules/test-results/test-results.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { AdminModule } from './modules/admin/admin.module';
import { AttachRoleMiddleware } from './middlewares/attach-user-role.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://user:12345@cluster0.1o4mdx1.mongodb.net/interactivequiz?retryWrites=true&w=majority'),UserModule, QuestionsModule, TestsModule, GroupsModule, StudentsModule, MaterialsModule, TestResultsModule, TeachersModule, AdminModule],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AttachRoleMiddleware)
      .forRoutes('*');
  }
}