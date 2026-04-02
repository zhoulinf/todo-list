import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T = any> {
  @ApiProperty({ description: '状态码', example: 0 })
  code: number;

  @ApiProperty({ description: '返回数据' })
  data: T;

  @ApiProperty({ description: '提示信息', example: 'success' })
  message: string;

  static success<T>(data: T): ResponseDto<T> {
    const res = new ResponseDto<T>();
    res.code = 0;
    res.data = data;
    res.message = 'success';
    return res;
  }

  static error(code: number, message: string): ResponseDto<null> {
    const res = new ResponseDto<null>();
    res.code = code;
    res.data = null;
    res.message = message;
    return res;
  }
}
