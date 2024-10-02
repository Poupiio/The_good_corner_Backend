import "reflect-metadata";
import express from "express";
import cors from 'cors';
import { dataSourceGoodCorner } from "./config/db";
import { Ad } from "./entities/Ad";
import { validate } from "class-validator";
import { Category } from "./entities/Category";
import { Like } from "typeorm";
import { Tag } from "./entities/Tag";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send("Hello World");
});

// GET ALL ADS
app.get("/ads", async (req, res) => {
  let ads: Ad[];
  
  if (req.query.category) {
    ads = await Ad.find({
      where: {
        category: { name: req.query.category as string },
      },
      relations: {
        tags: true
      },
    });
  } else {
    ads = await Ad.find({ relations: { tags: true } });
  }
  res.send(ads);
});

// GET AD BY ID
app.get("/ads/:id", async (req, res) => {
  const adById = await Ad.findOneByOrFail({ id: parseInt(req.params.id) });
  res.send(adById);
});

// CREATE AD
app.post("/ads", async (req, res) => {
  const newAd = new Ad();
  
  newAd.title = req.body.title;
  newAd.description = req.body.description;
  newAd.owner = req.body.owner;
  newAd.price = req.body.price;
  newAd.picture = req.body.picture;
  newAd.location = req.body.location;
  newAd.createdAt = req.body.createdAt;
  newAd.createdAt = req.body.createdAt;
  // Si une catégorie est trouvée, on l'applique, sinon on attribue par défaut la catégorie "Autre (id 6)"
  newAd.category = req.body.category ? req.body.category : 6;
  newAd.tags = req.body.tags ? req.body.category : "";

  const errors = await validate(newAd);
  if (errors.length > 0) {
    console.log(errors);
    res.status(400).send("Invalid input");
  } else {
    const result = await newAd.save();
    res.send(result);
  }
});

// UPDATE AD
app.put("/ads/:id", async (req, res) => {
  // findOneByOrFail() enverra une erreur js qui empêchera le code de s'exécuter (équivaut à un 'throw new Error')
  let adToUpdate = await Ad.findOneByOrFail({ id: parseInt(req.params.id) });
  adToUpdate = Object.assign(adToUpdate, req.body);

  const result = await adToUpdate.save();
  console.log(result);
  
  res.send(`Ad ${req.params.id} has been successfully updated.`);
});

// DELETE AD
app.delete("/ads/:id", async (req, res) => {
  const adToDelete = await Ad.delete(req.params.id);
  console.log(adToDelete);

  // Peut également s'écrire :
  // const id = parseInt(req.params.id);
  // await Ad.delete({ id });
  // res.send('OK');

  res.send("The ad has been successfully deleted.");
})



// ---------------- CATEGORIES ----------------- //
// GET ALL CATEGORIES
app.get("/categories", async (req, res) => {
  let categories: Category[];
  const categoryName = req.query.name;

  if (categoryName) {
    categories = await Category.find({
      where: {
        "name": Like(`${categoryName as string}%`)
      }
    });
  } else {
    categories = await Category.find();
  }

  res.send(categories);
});

// GET CATEGORY BY ID
app.get("/category/:id", async (req, res) => {
  const categoryById = await Category.findOneByOrFail({ id: parseInt(req.params.id) });
  res.send(categoryById);
});

// CREATE CATEGORY
app.post("/categories", async (req, res) => {
  const newCategory = new Category();
  newCategory.name = req.body.name;

  newCategory.save();
  res.send("Your category has been created");
});

// UPDATE A CATEGORY
app.put("/categories/:id", async (req, res) => {
  let categoryToUpdate = await Category.findOneByOrFail({ id: parseInt(req.params.id) });
  categoryToUpdate = Object.assign(categoryToUpdate, req.body);

  await categoryToUpdate.save();
  
  res.send(`Ad ${req.params.id} has been successfully updated.`);
});

// DELETE CATEGORY
app.delete("/categories/:id", async (req, res) => {
  await Category.delete(req.params.id);

  res.send("The category has been successfully deleted.");
})


// ---------------- TAGS ----------------- //
// GET ALL TAGS
app.get("/tags", async (req, res) => {
  let tags: Tag[];
  const tagName = req.query.name;

  if (tagName) {
    tags = await Tag.find({
      where: {
        "name": Like(`${tagName as string}%`)
      }
    });
  } else {
    tags = await Tag.find();
  }

  res.send(tags);
});

// GET TAG BY ID
app.get("/tags/:id", async (req, res) => {
  const tagById = await Tag.findOneByOrFail({ id: parseInt(req.params.id) });
  res.send(tagById);
});

// CREATE TAG
app.post("/tags", async (req, res) => {
  const newTag = new Tag();
  newTag.name = req.body.name;

  newTag.save();
  res.send("Your tag has been created");
});

// UPDATE TAG
app.put("/tags/:id", async (req, res) => {
  let tagToUpdate = await Tag.findOneByOrFail({ id: parseInt(req.params.id) });
  tagToUpdate = Object.assign(tagToUpdate, req.body);

  await tagToUpdate.save();
  
  res.send(`The tag ${req.params.id} has been successfully updated.`);
});

// DELETE TAG
app.delete("/tags/:id", async (req, res) => {
  await Tag.delete(req.params.id);

  res.send(`The tag ${req.params.id} has been successfully deleted.`);
})

app.listen(port, async () => {
  await dataSourceGoodCorner.initialize();
  console.log(`Example app listening on port ${port}`);
});