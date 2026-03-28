import { IsString, IsOptional, MaxLength, IsUUID, IsBoolean} from "class-validator";

export class CreateDepartamentDto{
    @IsUUID()
    organizationId:String;

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