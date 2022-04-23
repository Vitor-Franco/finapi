import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { IStatementsRepository } from "./../../repositories/IStatementsRepository";
import { IUsersRepository } from "./../../../users/repositories/IUsersRepository";
import { CreateStatementUseCase } from "./../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "./../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "./../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceError } from "./GetBalanceError";

let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("User's balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("Should be able to get balance", async () => {
    const user = await createUserUseCase.execute({
      email: "jenajilod@ruuz.gy",
      name: "Dennis Poole",
      password: "12345",
    });

    const response = await getBalanceUseCase.execute({
      user_id: user.id,
    });

    expect(response).toHaveProperty("balance");
  });

  it("Should not be able to get balance of an inexistent user", async () => {
    await expect(
      getBalanceUseCase.execute({
        user_id: "12345",
      })
    ).rejects.toEqual(new GetBalanceError());
  });
});
