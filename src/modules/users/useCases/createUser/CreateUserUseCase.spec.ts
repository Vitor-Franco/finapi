import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: IUsersRepository;
describe("Create a User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to create a new User", async () => {
    expect(
      await createUserUseCase.execute({
        email: "jenajilod@ruuz.gy",
        name: "Dennis Poole",
        password: "12345",
      })
    ).toHaveProperty("id");
  });

  it("Should not be able to create a existent user", async () => {
    await createUserUseCase.execute({
      email: "kilwu@cudkaas.ca",
      name: "Dennis Poole",
      password: "12345",
    });

    await expect(
      createUserUseCase.execute({
        email: "kilwu@cudkaas.ca",
        name: "Dennis Poole",
        password: "12345",
      })
    ).rejects.toEqual(new CreateUserError());
  });
});
