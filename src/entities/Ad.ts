// import { MaxLength } from "class-validator";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category";
import { Tag } from "./Tag";
import { Picture } from "./Picture";


@Entity()
export class Ad extends BaseEntity {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   title: string;

   @Column({ nullable: true })
   description?: string;

   @Column()
   owner: string;

   @Column()
   price: number;

   // @Column()
   // @MaxLength(2000)
   // picture: string;

   @Column()
   location: string;

   @Column()
   createdAt: Date;

   // 1er paramètre : callback vide qui pointe vers la table associée
   // 2ème paramètre (optionnel) : préciser le champ auquel on fait référence dans l'autre table : définition de la clé étrangère
   // ManyToOne : many ads appartiennent à one category
   @ManyToOne(
      () => Category, category => category.ads, { eager: true }
   )
   category: Category;

   @ManyToMany(
      () => Tag, tag => tag.ads, { eager: true }
   )
   @JoinTable()
   // @JoinTable obligatoire sur Ad ou Tag => définit la création de la table de jointure
   tags: Tag[];

   @OneToMany(() => Picture, (picture) => picture.ad, {
      cascade: true,
      eager: true,
   })
   pictures: Picture[];
}