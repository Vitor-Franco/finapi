import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "./../createUser/CreateUserUseCase";
import { IUsersRepository } from "./../../repositories/IUsersRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to get a authenticate user", async () => {
    await createUserUseCase.execute({
      email: "jenajilod@ruuz.gy",
      name: "Dennis Poole",
      password: "12345",
    });

    const resultUser = await authenticateUserUseCase.execute({
      email: "jenajilod@ruuz.gy",
      password: "12345",
    });

    expect(resultUser).toHaveProperty("token");
  });

  it("Should not be able to get an user with password incorrect", async () => {
    await createUserUseCase.execute({
      email: "jenajilod@ruuz.gy",
      name: "Dennis Poole",
      password: "12345",
    });

    await expect(
      authenticateUserUseCase.execute({
        email: "jenajilod@ruuz.gy",
        password: "testErroredPass",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("Should not be able to get an user with email incorrect", async () => {
    await createUserUseCase.execute({
      email: "jenajilod@ruuz.gy",
      name: "Dennis Poole",
      password: "12345",
    });

    await expect(
      authenticateUserUseCase.execute({
        email: "mail@error.com",
        password: "12345",
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
});
