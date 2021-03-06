module.exports = {
  createTable: (client) => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS parts (
        id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
        name varchar ,
        number bigint UNIQUE,
        metadata varchar DEFAULT null,
        list_price varchar,
        sale_price varchar
    );
  `;

    //Create Table
    client
      .query(createTableQuery)
      .then((res) => {
        console.log("Table is successfully created");
      })
      .catch((err) => {
        console.error(err);
      });
  },

  insertPart: (client, name, number, meta, list_price, sale_price) => {
    const insertQuery = `INSERT INTO parts(name, number, metadata, list_price, sale_price)
          VALUES ('${name}', ${number}, '${meta}', '${list_price}', '${sale_price}');
                        `;
    console.log(insertQuery, `\n`);
    client
      .query(insertQuery)
      .then((res) => {
        console.log("Part is added:", name);
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
