import { app } from "../app";
import request from "supertest";
import { User } from "../models/user";

const validUserCredentials = {
  name: "test",
  email: "test@test.com",
  password: "test1234",
  passwordConfirm: "test1234",
};

describe("register endpoint", () => {
  it("returns 400 if email is invalid", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      name: "test",
      email: "test",
      password: "test",
      passwordConfirm: "test",
    });
    expect(response.status).toEqual(400);
  });
  it("returns 400 if password and passwordConfirm do not match", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test",
        email: "test@test.com",
        password: "test123",
        passwordConfirm: "test1234",
      })
      .expect(401);
  });
  it("returns 201 if valid credentials were provided", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send(validUserCredentials)
      .expect(201);
  });
  it("returns 401 if email is already in use", async () => {
    await request(app)
      .post("/api/v1/auth/register")
      .send(validUserCredentials)
      .expect(201);

    await request(app)
      .post("/api/v1/auth/register")
      .send(validUserCredentials)
      .expect(401);
  });

  it("sets a cookie after successful registration", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(validUserCredentials);
    expect(response.get("Set-Cookie")).toBeDefined();
  });

  it("save hashed password to database", async () => {
    await request(app).post("/api/v1/auth/register").send(validUserCredentials);
    const user = await User.findOne({ email: validUserCredentials.email });
    expect(user?.password).not.toEqual(validUserCredentials.password);
  });

  it("should not save confirm password to database", async () => {
    await request(app).post("/api/v1/auth/register").send(validUserCredentials);
    const user = await User.findOne({
      email: validUserCredentials.email,
    });
    expect(user?.passwordConfirm).toBeUndefined();
  });
});
