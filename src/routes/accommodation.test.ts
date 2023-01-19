import { app } from "../app";
import request from "supertest";
import { Accommodation } from "../models/accommodation";

const validAccommodationMock = {
  name: "home",
  price: "500",
  location: {
    type: "Point",
    coordinates: [-122.5, 37.7],
  },
};

describe("create accommodation endpoint", () => {
  it("return 400 if name is not provided", async () => {
    await request(app)
      .post("/api/v1/accommodations")
      .send({
        description: "test",
        price: 100,
        location: "test",
        images: ["test"],
      })
      .expect(400);
  });
  it("return 401 if user is not authenticated", async () => {
    await request(app)
      .post("/api/v1/accommodations")
      .send({
        name: "home",
        price: "500",
        location: {
          type: "Point",
          coordinates: [-122.5, 37.7],
        },
      })
      .expect(401);
  });
  it("return 201 if valid credentials were provided", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test",
        email: "test@test.com",
        password: "test123",
        passwordConfirm: "test123",
      })
      .expect(201);
    await request(app)
      .post("/api/v1/accommodations")
      .set("Cookie", response.get("Set-Cookie"))
      .send(validAccommodationMock)
      .expect(201);
  });
  it("should save accommodation to database", async () => {
    let accommodations = await Accommodation.find({});
    expect(accommodations.length).toBe(0);
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test",
        email: "test@test.com",
        password: "test123",
        passwordConfirm: "test123",
      })
      .expect(201);
    await request(app)
      .post("/api/v1/accommodations")
      .set("Cookie", response.get("Set-Cookie"))
      .send(validAccommodationMock)
      .expect(201);

    accommodations = await Accommodation.find({});
    expect(accommodations.length).toBe(1);
  });
});

describe("get accommodation endpoint", () => {
  it("returns empty array if no accommodations are found", async () => {
    const response = await request(app).get("/api/v1/accommodations").send();
    expect(response.body).toEqual([]);
  });
  it("returns array of accommodations if accommodations are found", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test",
        email: "test@test.com",
        password: "test123",
        passwordConfirm: "test123",
      })
      .expect(201);
    await request(app)
      .post("/api/v1/accommodations")
      .set("Cookie", response.get("Set-Cookie"))
      .send({ ...validAccommodationMock, name: "home 2" })
      .expect(201);
    await request(app)
      .post("/api/v1/accommodations")
      .set("Cookie", response.get("Set-Cookie"))
      .send({ ...validAccommodationMock, name: "home 3" })
      .expect(201);
    const response2 = await request(app).get("/api/v1/accommodations").send();
    expect(response2.body.length).toBe(2);
    expect(response2.body[0].name).toBe("home 2");
    expect(response2.body[1].name).toBe("home 3");
    expect(response2.status).toBe(200);
  });
});

describe("get accommodation by id endpoint", () => {
  it("returns 400 if provided id is not valid", async () => {
    await request(app).get("/api/v1/accommodations/123").send().expect(400);
  });
  it("returns 404 if accommodation is not found", async () => {
    await request(app)
      .get("/api/v1/accommodations/5f7e6b2f8c9c1b1d7c0c6d5e")
      .send()
      .expect(404);
  });
  it("returns accommodation if accommodation is found", async () => {
    const responseReg = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test",
        email: "test@test.com",
        password: "test123",
        passwordConfirm: "test123",
      })
      .expect(201);
    const responseAcc = await request(app)
      .post("/api/v1/accommodations")
      .set("Cookie", responseReg.get("Set-Cookie"))
      .send(validAccommodationMock)
      .expect(201);

    await request(app)
      .get(`/api/v1/accommodations/${responseAcc.body.id}`)
      .send()
      .expect(200);
  });
});

describe("update accommodation endpoint", () => {
  it("returns 400 if accommmodation with provided id does not exist", async () => {
    await request(app)
      .patch("/api/v1/accommodations/123")
      .send({ name: "test" })
      .expect(404);
  });
  it("returns 401 if user is not authenticated", async () => {
    const responseReg = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test",
        email: "test@test.com",
        password: "test123",
        passwordConfirm: "test123",
      })
      .expect(201);
    const responseAcc = await request(app)
      .post("/api/v1/accommodations")
      .set("Cookie", responseReg.get("Set-Cookie"))
      .send(validAccommodationMock)
      .expect(201);
    await request(app)
      .put(`/api/v1/accommodations/${responseAcc.body.id}`)
      .send({
        name: "new test",
      })
      .expect(401);

    const accommodation = await Accommodation.findById(responseAcc.body.id);
    expect(accommodation?.name).toBe("home");
  });
  it("returns updated accommodation if user is authenticated and valid data is provided", async () => {
    const responseReg = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test",
        email: "test@test.com",
        password: "test123",
        passwordConfirm: "test123",
      })
      .expect(201);
    const responseAcc = await request(app)
      .post("/api/v1/accommodations")
      .set("Cookie", responseReg.get("Set-Cookie"))
      .send(validAccommodationMock)
      .expect(201);
    await request(app)
      .put(`/api/v1/accommodations/${responseAcc.body.id}`)
      .set("Cookie", responseReg.get("Set-Cookie"))
      .send({
        name: "new test",
      })
      .expect(200);

    const accommodation = await Accommodation.findById(responseAcc.body.id);
    expect(accommodation?.name).toBe("new test");
  });
});

describe("delete accommodation endpoint", () => {
  it("returns 400 if provided id is not valid", async () => {
    await request(app).delete("/api/v1/accommodations/123").send().expect(400);
  });
  it("returns 404 if accommodation is not found", async () => {
    const responseReg = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test",
        email: "test@test.com",
        password: "test123",
        passwordConfirm: "test123",
      })
      .expect(201);
    await request(app)
      .delete("/api/v1/accommodations/5f7e6b2f8c9c1b1d7c0c6d5e")
      .set("Cookie", responseReg.get("Set-Cookie"))
      .send()
      .expect(404);
  });
  it("returns 401 if user is not authenticated", async () => {
    const responseReg = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test",
        email: "test@test.com",
        password: "test123",
        passwordConfirm: "test123",
      })
      .expect(201);
    const responseAcc = await request(app)
      .post("/api/v1/accommodations")
      .set("Cookie", responseReg.get("Set-Cookie"))
      .send(validAccommodationMock)
      .expect(201);

    await request(app)
      .delete(`/api/v1/accommodations/${responseAcc.body.id}`)
      .send()
      .expect(401);
  });
  it("returns 200 if accommodation is deleted", async () => {
    const responseReg = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test",
        email: "test@test.com",
        password: "test123",
        passwordConfirm: "test123",
      })
      .expect(201);
    const responseAcc = await request(app)
      .post("/api/v1/accommodations")
      .set("Cookie", responseReg.get("Set-Cookie"))
      .send(validAccommodationMock)
      .expect(201);

    await request(app)
      .delete(`/api/v1/accommodations/${responseAcc.body.id}`)
      .set("Cookie", responseReg.get("Set-Cookie"))
      .send()
      .expect(200);
  });
  it("returns 401 if user is not owner of accommodation", async () => {
    const responseReg = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test",
        email: "test@test.com",
        password: "test123",
        passwordConfirm: "test123",
      })
      .expect(201);
    const responseAcc = await request(app)
      .post("/api/v1/accommodations")
      .set("Cookie", responseReg.get("Set-Cookie"))
      .send(validAccommodationMock)
      .expect(201);

    const responseReg2 = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "test",
        email: "test2@test.com",
        password: "test123",
        passwordConfirm: "test123",
      })
      .expect(201);

    await request(app)
      .delete(`/api/v1/accommodations/${responseAcc.body.id}`)
      .set("Cookie", responseReg2.get("Set-Cookie"))
      .send()
      .expect(401);
  });
});
