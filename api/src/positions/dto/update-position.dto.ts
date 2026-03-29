import { PartialType } from "@nestjs/mapped-types";
import { CreatePositionDto } from "./create-positions.dto";

export class UpdatePositionDto extends PartialType(CreatePositionDto){}