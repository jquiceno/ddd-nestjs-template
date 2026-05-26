import { IsDate, IsIn, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetServiceInfoDto {
  @ApiProperty({ example: 'ok', enum: ['ok'] })
  @IsNotEmpty()
  @IsIn(['ok'])
  status!: 'ok'

  @ApiProperty({ example: 'my-service' })
  @IsString()
  name!: string

  @ApiProperty({ example: '1.0.0' })
  @IsString()
  version!: string

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @IsDate()
  startedAt!: Date
}
