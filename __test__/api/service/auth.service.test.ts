import { omit } from 'lodash';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import authService from '../../../src/api/service/auth.service';
import * as bcryptCommon from '../../../src/common/bcrypt';
import { EHttpStatus } from '../../../src/constant/statusCode';
import UserModel from '../../../src/model/user';
import { TRegisterPayload } from '../../../src/types/api/auth.types';
import { TUserSchema } from '../../../src/types/schema/user.schema.types';

describe('Testing auth service', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe('Register service', () => {
    afterAll(async () => {
      const userPayload: TUserSchema = {
        email: 'tester.001@company.com',
        password: bcryptCommon.bcryptHashSync('Tester@001'),
        fullName: 'Tester 001',
        avatar: 's3_img_string',
        dateOfBirth: new Date(),
      };

      await UserModel.deleteMany({ email: userPayload.email });
    });

    describe('Given valid payload', () => {
      it('should return statusCode 200 and data is null and message is "Register successfully"', async () => {
        const userPayload: TUserSchema = {
          email: 'tester.001@company.com',
          password: bcryptCommon.bcryptHashSync('Tester@001'),
          fullName: 'Tester 001',
          avatar: 's3_img_string',
          dateOfBirth: new Date(),
        };

        const mockRegisterPayload: TRegisterPayload = {
          ...omit(userPayload, ['avatar', 'dateOfBirth']),
          password: 'Tester@001',
        };

        const spyedUserModelCreate = jest.spyOn(UserModel, 'create');
        const resolveData = {
          statusCode: EHttpStatus.OK,
          data: null,
          message: 'Register successfully',
        };

        await expect(authService.register(mockRegisterPayload)).resolves.toStrictEqual(resolveData);
        expect(spyedUserModelCreate).toHaveBeenCalledWith({
          ...mockRegisterPayload,
          password: expect.any(String),
        });
        spyedUserModelCreate.mockClear();
      });
    });

    describe('Given invalid payload', () => {
      describe('Given exist email', () => {
        it('should return error is instanceOf MongoServerError and message contains "duplicate key error collection"', async () => {
          const userPayload: TUserSchema = {
            email: 'tester.001@company.com',
            password: bcryptCommon.bcryptHashSync('Tester@001'),
            fullName: 'Tester 001',
            avatar: 's3_img_string',
            dateOfBirth: new Date(),
          };

          const mockRegisterPayload: TRegisterPayload = {
            ...omit(userPayload, ['avatar', 'dateOfBirth']),
            password: 'Tester@001',
          };
          await expect(authService.register(mockRegisterPayload)).rejects.toBeInstanceOf(
            mongoose.mongo.MongoServerError,
          );
          expect(authService.register(mockRegisterPayload)).rejects.toEqual(
            expect.objectContaining({ message: expect.stringContaining('duplicate key error collection') }),
          );
        });
      });

      describe('Given invalid email format', () => {
        it('should return error is instanceOf MongoServerError and message "Email format is invalid', async () => {
          const userPayload: TUserSchema = {
            email: 'tester.001@company.com',
            password: bcryptCommon.bcryptHashSync('Tester@001'),
            fullName: 'Tester 001',
            avatar: 's3_img_string',
            dateOfBirth: new Date(),
          };

          const mockRegisterPayload: TRegisterPayload = {
            ...omit(userPayload, ['avatar', 'dateOfBirth']),
            password: 'Tester@001',
          };
          const invalidEmailFormat = 'LoremIpsum';
          const mockLocalLoginPayloadInvalidEmail = { ...mockRegisterPayload, email: invalidEmailFormat };

          await expect(authService.register(mockLocalLoginPayloadInvalidEmail)).rejects.toBeInstanceOf(
            mongoose.Error.ValidationError,
          );
          expect(authService.register(mockLocalLoginPayloadInvalidEmail)).rejects.toEqual(
            expect.objectContaining({ message: expect.stringContaining('Email format is invalid') }),
          );
        });
      });
    });
  });
});
