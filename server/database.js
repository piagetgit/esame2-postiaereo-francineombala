"use strict"

const sqlite = require("sqlite3");
const crypto = require("crypto");

/**
 * Wrapper around db.al
 */
const dbAllAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
  console.log("prenotazioni");
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else     resolve(rows);
  });
});

/**
 * Wrapper around db.run
 */
const dbRunAsync = (db, sql, params = []) => new Promise((resolve, reject) => {
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
      "select * from students where email = ?",
      [email]
    )
      .then(student => {
        // If there is no such student, resolve to false.
        // This is used instead of rejecting the Promise to differentiate the
        // failure from database errors
        if (!student) resolve(false);

        // Verify the password
        crypto.scrypt(password, student.salt, 32, (err, hash) => {
          if (err) reject(err);

          if (crypto.timingSafeEqual(hash, Buffer.from(student.hash, "hex")))
            resolve({id: student.id, username: student.email, name: student.name, fullTime: student.full_time === null ? null : Boolean(student.full_time)}); // Avoid full_time = null being cast to false
          else resolve(false);
        });
      })
      .catch(e => reject(e));
  });

  /**
   * Retrieve the student with the specified id
   * 
   * @param id the id of the student to retrieve
   * 
   * @returns a Promise that resolves to the user object {id, username, name, fullTime}
   */
  /*this.getStudent = async id => {
    const student = await dbGetAsync(
      this.db,
      "select email as username, name, full_time as fullTime from students where id = ?",
      [id]
    );

    return {...student, id, fullTime: student.fullTime === null ? null : Boolean(student.fullTime)};
  };
  */

  /**
   * Retrieve the student with the specified id
   * @returns a Promise that resolves to the user object {id, username, name, fullTime}
   */
  this.getAereo = async () => {
    const aerei =  await dbAllAsync(
      this.db,
      "select id_aereo, numero_posti, numero_file, tipo_aereo from aereo"
    );
    console.log(aerei);
    return [...aerei];
  };

  
  /**
   * Retrieve the student with the specified id
   * @returns a Promise that resolves to the user object {id, username, name, fullTime}
   */
  this.getPrenotazioni = async (aereo_id) => {
    console.log(aereo_id);
    const prenotazioni =  await dbAllAsync(
      this.db,
      "select posti_prenotati from prenotazioni where aereo_id = ?",
      [aereo_id]
    );
    console.log(prenotazioni);
    return [...prenotazioni];
  };

   /**
   * Retrieve the student with the specified id
   * 
   * @param id the id of the student to retrieve
   * 
   * @returns a Promise that resolves to the user object {id, username, name, fullTime}
   */
   this.getUser = async id => {
    const student = await dbGetAsync(
      this.db,
      "select * from users where email = ?",
      [id]
    );

    return {...student};
  };
  
}

module.exports = Database;
