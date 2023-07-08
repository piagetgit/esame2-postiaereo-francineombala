"use strict"

const sqlite = require("sqlite3");
const crypto = require("crypto");

/**
 * Wrapper around db.al
 */
const dbAllAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else     resolve(rows);
  });
});

/**
 * Wrapper around db.run
 */
const dbRunAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  //console.log("wsf")
  db.run(sql, params, err => {
    if (err) reject(err);
    else     resolve();
  });
});

/**
 * Wrapper around db.get
 */
const dbGetAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else     resolve(row);
  });
});

/**
 * Interface to the sqlite database for the application
 *
 * @param dbname name of the sqlite3 database file to open
 */
function Database(dbname) {
  this.db = new sqlite.Database(dbname, err => {
    if (err) throw err;
  });


  /**
   * Authenticate a user from their email and password
   * 
   * @param email email of the user to authenticate
   * @param password password of the user to authenticate
   * 
   * @returns a Promise that resolves to the user object {id, username, name, fullTime}
   */
  this.authUser = (email, password) => new Promise((resolve, reject) => {
    // Get the student with the given email
    
    dbGetAsync(
      this.db,
      "select * from users where email = ?",
      [email]
    )
      .then(user => {
        // If there is no such student, resolve to false.
        // This is used instead of rejecting the Promise to differentiate the
        // failure from database errors
        if (!user) resolve(false);

        // Verify the password
        //console.log(user)
        crypto.scrypt(password, user.salt, 32, (err, hash) => {
          if (err) reject(err);

          if (crypto.timingSafeEqual(hash, Buffer.from(user.hash, "hex")))
            resolve({id: user.id, username: user.email, name: user.name}); // Avoid full_time = null being cast to false
          else resolve(false);
        });
      })
      .catch(e => reject(e));
  });


  /**
   * Retrieve the student with the specified id
   * @returns a Promise that resolves to the user object {id, username, name, fullTime}
   */
  this.getAereo = async (id) => {
    const aereo =  await dbGetAsync(
      this.db,
      "select * from aereo where aereo_id = ?",
      [id]
    );
    return {...aereo};
  };

  this.insertPrenotazione = async (id) => {
    return 1;
  };
  
  /**
   * Retrieve the student with the specified id
   * @returns a Promise that resolves to the user object {id, username, name, fullTime}
   */
  this.getPrenotazioni = async (aereo_id) => {
    //console.log(aereo_id);
    const postiPrenotati =  await dbAllAsync(
      this.db,
      "select posti_prenotati from prenotazioni where aereo_id = ?",
      [aereo_id]
    );
    //console.log(prenotazioni);
    return [...postiPrenotati];
  };

   /**
   * Retrieve the user with the specified id
   * 
   * @param id the id of the student to retrieve
   * 
   * @returns a Promise that resolves to the user object {id, username, name, fullTime}
   */
   this.getUser = async id => {
    const user = await dbGetAsync(
      this.db,
      "select * from users where id = ?",
      [id]
    );

    return {...user};
  };
  
  /**
   * Retrieve the user with the specified id
   * 
   * @param id the id of the student to retrieve
   * 
   * @returns a Promise that resolves to the user object {id, username, name, fullTime}
   */
  this.insertPrenotazione = async(aereo_id, email_utente, posti_prenotati) => {
    console.log(posti_prenotati)
    await dbAllAsync(
      this.db,
      "INSERT INTO prenotazioni (aereo_id,email_utente,posti_prenotati) Values (?,?,?)",
      [aereo_id,email_utente,posti_prenotati]
    );
  };

  
}

module.exports = Database;
