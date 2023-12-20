import { bcryptHashSync } from '../../common/bcrypt';
import { EHttpStatus } from '../../constant/statusCode';
import UserModel from '../../model/user';
import { TRegisterPayload } from '../../types/api/auth.types';
import { TServiceResponseType } from '../../types/general.types';

const authService = {
  register: async (reqBody: TRegisterPayload): Promise<TServiceResponseType> => {
    reqBody.password = bcryptHashSync(reqBody.password);
    await UserModel.create(reqBody);

    return {
      data: null,
      statusCode: EHttpStatus.OK,
      message: 'Register successfully',
    };
  },
};

export default authService;
