import axios from "axios";

describe("user resolvers", () => {
  test("allUsers", async () => {
    const response = await axios.post("http://localhost:8081/graphql", {
      query: `
        query {
            allUsers {
                id
                username
                email
            }
        }
        `
    });

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        allUsers: []
      }
    });
  });

  test("register", async () => {
    const response = await axios.post("http://localhost:8081/graphql", {
      query: `
          mutation {
              register(username: "test", email: "test@test.com", password: "test@test") {
                 ok
                 errors {
                     path
                     message
                 }
                 user {
                     username
                     email
                 }
              }
          }
          `
    });

    const { data } = response;

    expect(data).toMatchObject({
      data: {
        register: {
          ok: true,
          errors: null,
          user: {
            username: "test",
            email: "test@test.com"
          }
        }
      }
    });
  });
});
