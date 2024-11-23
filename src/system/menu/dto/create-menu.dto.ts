import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

//菜单类型
export enum MenuTypeEnum {
  M = 'M',
  C = 'C',
  F = 'F',
}

export class CreateMenuDto {
  @IsNotEmpty({
    message: '父菜单ID不能为空',
  })
  @IsNumber()
  parentId: number;

  @IsNotEmpty({
    message: '菜单类型不能为空',
  })
  @IsString()
  @IsEnum(MenuTypeEnum)
  menuType: string;

  @IsNotEmpty({
    message: '菜单名称不能为空',
  })
  @IsString({ message: '菜单名称必须是字符串' })
  @Length(0, 50)
  menuName: string;

  @IsOptional()
  @IsString()
  perms?: string;

  @IsNotEmpty({
    message: '菜单状态不能为空',
  })
  @IsBoolean({ message: 'status必须是布尔值' })
  status: boolean;

  @IsOptional()
  @IsBoolean({ message: 'visible必须是布尔值' })
  visible?: boolean;

  @IsOptional()
  @IsNumber()
  orderNum: number;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  path?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  query: string;

  @IsOptional()
  @IsString()
  @Length(0, 255)
  component?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  icon?: string;

  @IsOptional()
  @IsBoolean({ message: 'isFrame必须是布尔值' })
  isFrame?: boolean;
}
