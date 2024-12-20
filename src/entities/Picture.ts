import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ad } from "./Ad";

@Entity()
export class Picture extends BaseEntity {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   url: string;

   @ManyToOne(() => Ad, (ad) => ad.pictures)
   ad: Ad;
}