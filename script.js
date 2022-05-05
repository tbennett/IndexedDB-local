(async function () {
  "use strict";

  //DOM elements to contain the results
  let movies_list = document.querySelector(".movies");
  let char_list = document.querySelector(".characters");

  // create new indexDB database
  var db = new Dexie("StarWarsDatabase");

  // Define the database schema(structure), which includes tables and their key indices
  db.version(1).stores({
    movies: `id, title`,
    characters: `id, name`
  });

  // Now populate the movies table
  await db.movies.bulkPut([
    { id: 1, title: "A New Hope" },
    { id: 2, title: "The Empire Strikes Back" },
    { id: 3, title: "Return of the Jedi" },
    { id: 4, title: "The Phantom Menace" },
    { id: 5, title: "Attack of the Clones" },
    { id: 6, title: "Revenge of the Sith" },
    { id: 7, title: "Rouge One" }
  ]);

  // Now populate the characters table
  await db.characters.bulkPut([
    { id: 1, name: "R2D2" },
    { id: 2, name: "C3PO" },
    { id: 3, name: "Darth Vadar" },
    { id: 4, name: "Leia Organa" },
    { id: 5, name: "Obi Wan Kenobi" },
    { id: 6, name: "Luke Skywalker" },
    { id: 7, name: "Han Solo" },
    { id: 8, name: "Chewbacca" },
    { id: 9, name: "Yoda" },
    { id: 10, name: "Anakin Skywalker" }
  ]);

  // make some transactions/queries of the database
  await db
    .transaction("rw", db.movies, db.characters, async (tx) => {
      let info = [];

      // query the db and convert the results into an easy to use array.
      // get all of the records in the movies table.
      info[0] = await db.movies.toArray();

      // where clause methods:
      // https://dexie.org/docs/WhereClause/WhereClause#methods
      // get only specific characters
      info[1] = await db.characters.where("name").startsWith("C").toArray();
      return info;
    })
    .then((results) => {
    
      // build the UI to display the data
      results[0].forEach((movie) => {
        const li = document.createElement("LI");
        li.textContent = movie.title;
        movies_list.append(li);
      });

      results[1].forEach((character) => {
        const li = document.createElement("LI");
        li.textContent = character.name;
        char_list.append(li);
      });
    })
    .catch((err) => {
      // if there's an error along the way.
      console.log("Ouch...there was an error " + err);
    });
} ()); 
// end Immediately Invoked Function Expression (IIFE)
//The IIFE Pattern looks like this:  
/* 

(function(){  } ()); 

or formatted for readability:

(function(){
    // code here
    // and here
} ()); 


*/