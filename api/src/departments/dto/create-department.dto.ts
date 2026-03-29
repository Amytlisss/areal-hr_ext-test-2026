import { IsString, IsOptional, MaxLength, IsUUID, IsBoolean} from "class-validator";

export class CreateDepartmentDto{
    @IsUUID()
    organizationId:string;

    @IsOptional()
    @IsUUID()
    parentId?:string | null;

    @IsString()
    @MaxLength(255)
    name: string;

    @IsOptional()
    @IsString()
    comment?:string;
}