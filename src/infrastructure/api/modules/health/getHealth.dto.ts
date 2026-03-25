import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class GetHealthStatusDto {
  @IsNotEmpty()
  @IsIn(['ok'])
  status!: 'ok';

  @IsString()
  serviceName!: string;

  @IsString()
  version!: string;
}
