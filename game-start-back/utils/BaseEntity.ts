import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
export abstract class BaseEntity{
    @ApiProperty({example:'1',description:"Id of current entity"})
    @PrimaryGeneratedColumn()
    id:number
    
    @ApiProperty({example:'12345678',description:"Current ntity creation date"})
    createdAt:Date

    @ApiProperty({example:'12345678',description:"Current entity update date"})
    @UpdateDateColumn()
    updatedAt:Date
}