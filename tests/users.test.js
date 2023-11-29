const crypto = require("node:crypto");

const request = require("supertest");


const app = require("../src/app");

const database = require("../database");

afterAll(() => database.end());

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });
});

describe("GET /api/users/:id", () => {
  it("should return one user", async () => {
    const response = await request(app).get("/api/users/1");

    expect(response.headers["content-type"]).toMatch(/json/);

    expect(response.status).toEqual(200);
  });

  it("should return no user", async () => {
    const response = await request(app).get("/api/users/0");

    expect(response.status).toEqual(404);
  });
});

describe("POST /api/users", () => {
  it("should return created user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    const response = await request(app).post("/api/users").send(newUser);

    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");

    const [result] = await database.query(
      "SELECT * FROM users WHERE id=?",
      response.body.id
    );

    const [usersInDatabase] = result;

    expect(usersInDatabase).toHaveProperty("id");

    expect(usersInDatabase).toHaveProperty("firstname");
    expect(usersInDatabase.firstname).toStrictEqual(newUser.firstname);

    expect(usersInDatabase).toHaveProperty("lastname");
    expect(usersInDatabase.lastname).toStrictEqual(newUser.lastname);

    expect(usersInDatabase).toHaveProperty("email");
    expect(usersInDatabase.email).toStrictEqual(newUser.email);

    expect(usersInDatabase).toHaveProperty("city");
    expect(usersInDatabase.city).toStrictEqual(newUser.city);

    expect(usersInDatabase).toHaveProperty("language");
    expect(usersInDatabase.language).toStrictEqual(newUser.language);
  });
  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Marie" };

    const response = await request(app)
      .post("/api/users")
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });
})

describe("PUT /api/users/:id", () => {
  it("should edit user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };
    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );

    const id = result.insertId;

    const updatedUser = {
      firstname: "Marie-lou",
      lastname: "MartinMatin",
      email: `${crypto.randomUUID()}@wilde.co`,
      city: "Par",
      language: "Fr",
    };

    const response = await request(app)
      .put(`/api/users/${id}`)
      .send(updatedUser);

    expect(response.status).toEqual(204);
    
    const [users] = await database.query(
      "SELECT * FROM users WHERE id=?",
      id
    );

    const [usersInDatabase] = users;

    expect(usersInDatabase).toHaveProperty("id");

    expect(usersInDatabase).toHaveProperty("firstname");
    expect(usersInDatabase.firstname).toStrictEqual(updatedUser.firstname);

    expect(usersInDatabase).toHaveProperty("lastname");
    expect(usersInDatabase.lastname).toStrictEqual(updatedUser.lastname);

    expect(usersInDatabase).toHaveProperty("email");
    expect(usersInDatabase.email).toStrictEqual(updatedUser.email);

    expect(usersInDatabase).toHaveProperty("city");
    expect(usersInDatabase.city).toStrictEqual(updatedUser.city);

    expect(usersInDatabase).toHaveProperty("language");
    expect(usersInDatabase.language).toStrictEqual(updatedUser.language);
  });
  it("should return an error", async () => {
    const userWithMissingProps = { firstname: "Harry" };

    const response = await request(app)
      .put(`/api/users/1`)
      .send(userWithMissingProps);

    expect(response.status).toEqual(422);
  });

  it("should return no user", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };

    const response = await request(app).put("/api/users/0").send(newUser);

    expect(response.status).toEqual(404);});

});

describe("DELETE /api/movies/:id", () => {
  it("should delete users", async () => {
    const newUser = {
      firstname: "Marie",
      lastname: "Martin",
      email: `${crypto.randomUUID()}@wild.co`,
      city: "Paris",
      language: "French",
    };
    const [result] = await database.query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [
        newUser.firstname,
        newUser.lastname,
        newUser.email,
        newUser.city,
        newUser.language,
      ]
    );

    const id = result.insertId;

    const response = await request(app).delete(`/api/users/${id}`).send(newUser);
    expect(response.status).toEqual(204);

    const checkGet = await request(app).get(`/api/users/${id}`).send(newUser);
    expect(checkGet.status).toEqual(404);
  
  
  });
    

})
