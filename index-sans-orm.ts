import express from "express";
import sqlite3 from "sqlite3";
const db = new sqlite3.Database('good_corner.sqlite');

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.get("/ads", (_req, res) => {
  db.all("SELECT * FROM ad", (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});

// Si on voulait faire une route spécifique pour une propriété mais qu'il existe déjà une route '/:something'
// app.get("/ads/location/:location", (req, res) => {
//   const stmt = db.prepare("SELECT * FROM ad WHERE location LIKE '%?%'");

//   stmt.all([req.params.location], (err, rows) => {
    
//     if (err) {
//       console.log(err);
//     } else {
//       res.send(rows);
//     }
//   })
// });

app.get("/ads", (req, res) => {
  if (req.query.location) {
    db.all(
      "SELECT * from ad WHERE location LIKE ?",
      req.query.location,
      (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          res.send(rows);
        }
      }
    );
  } else {
    db.all("SELECT * from ad", (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        res.send(rows);
      }
    });
  }
});

app.get("/ads/:id", (req, res) => {
  const stmt = db.prepare("SELECT * FROM ad where id = ?");

  stmt.all([req.params.id], (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  })
});


app.post("/ads", (req, res) => {
   const stmt = db.prepare("INSERT INTO ad (title, description, owner, price, picture, location, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)");
   stmt.run([
      req.body.title,
      req.body.description,
      req.body.owner,
      req.body.price,
      req.body.picture,
      req.body.location,
      req.body.createdAt
   ]);

   res.send("The new ad has been successfully created.");
});

// Modification complète
app.put("/ads/:id", (req, res) => {
  const stmt = db.prepare("UPDATE ad SET title = ?, description = ?, owner = ?, price = ?, picture = ?, location = ?, createdAt = ? WHERE id = ?");
  stmt.run([
    req.body.title,
    req.body.description,
    req.body.owner,
    req.body.price,
    req.body.picture,
    req.body.location,
    req.body.createdAt,
    req.params.id
  ]);

  res.send(`Ad ${req.params.id} has been successfully updated.`);
});

// Modification partielle
app.put("/ads/:id", (req, res) => {
  db.get(
      "SELECT * FROM ad WHERE id = (?)",
      req.params.id,
      (_err, data: any) => {
         const stmt = db.prepare(
         "UPDATE ad SET title = ?, description = ?, owner = ?, price = ?, picture = ?, location = ?, createdAt = ? WHERE id = ?"
         );
         stmt.run([
            req.body.title ? req.body.title : data.title,
            req.body.description ? req.body.description : data.description,
            req.body.owner ? req.body.owner : data.owner,
            req.body.price ? req.body.price : data.price,
            req.body.picture ? req.body.picture : data.picture,
            req.body.location ? req.body.location : data.location,
            req.body.createdAt ? req.body.createdAt : data.createdAt,
            req.params.id,
         ]);

         res.send(`Ad ${req.params.id} has been successfully updated.`);
   });
});

app.delete("/ads", (_req, res) => {
  db.run("DELETE FROM ad WHERE price > 40");
  res.send("All the ads with a price above 40 have been successfully removed");
})

app.delete("/ads/:id", (req, res) => {
   const stmt = db.prepare("DELETE FROM ad WHERE id = ?");
   stmt.run([req.params.id]);

   res.send("The ad has been successfully deleted.");
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});