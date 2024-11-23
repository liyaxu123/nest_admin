import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({
    message: '角色名称不能为空',
  })
  @IsString()
  @Length(0, 30)
  roleName: string;

  @IsNotEmpty({
    message: '权限字符不能为空',
  })
  @IsString()
  @Length(0, 100)
  roleKey: string;

  @IsOptional()
  @IsNumber({}, { message: 'roleSort必须是数字' })
  roleSort?: number;

  @IsOptional()
  @IsBoolean({ message: 'status必须是布尔值' })
  status?: boolean;

  @IsOptional()
  @IsArray({ message: 'menuIds必须是数组' })
  menuIds?: Array<number>;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  remark?: string;
}
