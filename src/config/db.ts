<<<<<<< HEAD
import { Picture } from "src/entities/Picture";
=======
>>>>>>> ab987672d329d73bcd3e28f11ec1258ed549b79b
import { Ad } from "../entities/Ad";
import { Category } from "../entities/Category";
import { Tag } from "../entities/Tag";
import { DataSource } from "typeorm";

export const dataSourceGoodCorner = new DataSource({
   database: "good_corner.sqlite",
   type: "sqlite",
<<<<<<< HEAD
   entities: [Ad, Category, Tag, Picture],
=======
   entities: [Ad, Category, Tag],
>>>>>>> ab987672d329d73bcd3e28f11ec1258ed549b79b
   synchronize: true,
   logging: ["error", "query"]
});