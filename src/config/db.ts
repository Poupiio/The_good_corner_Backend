
import { Picture } from "src/entities/Picture";
import { Ad } from "../entities/Ad";
import { Category } from "../entities/Category";
import { Tag } from "../entities/Tag";
import { DataSource } from "typeorm";

export const dataSourceGoodCorner = new DataSource({
   database: "good_corner.sqlite",
   type: "sqlite",
   entities: [Ad, Category, Tag, Picture],
   synchronize: true,
   logging: ["error", "query"]
});