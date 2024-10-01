import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ad } from "./Ad";

@Entity()
export class Category extends BaseEntity {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({ unique: true })
   name: string;

   // 1er paramètre : callback vide qui pointe vers la table associée
   // 2ème paramètre : préciser le champ auquel on fait référence dans l'autre table
   // OneToMany : une catégorie peut avoir plusieurs ads
   @OneToMany(
      () => Ad, ad => ad.category
   )
   ads: Ad[];
}