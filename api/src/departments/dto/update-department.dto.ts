import { PartialType } from "@nestjs/mapped-types";
import { CreateDepartamentDto } from "./create-department.dto";

export class UpdateDepartmentDto extends PartialType(CreateDepartamentDto){}