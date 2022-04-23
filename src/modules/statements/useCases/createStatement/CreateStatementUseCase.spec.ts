import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateUserUseCase } from "./../../../users/useCases/createUser/CreateUserUseCase";
import { IUsersRepository } from "./../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "./../../repositories/IStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";

let inMemoryUsersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let inMemoryStatementsRepository: IStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to create a withdraw statement", async () => {
    const user = await createUserUseCase.execute({
      email: "jenajilod@ruuz.gy",
      name: "Dennis Poole",
      password: "12345",
    });

    await createStatementUseCase.execute({
      amount: 12345,
      description: "Teste deposit",
      type: "deposit" as OperationType,
      user_id: user.id,
    });

    const statement = await createStatementUseCase.execute({
      amount: 1234,
      description: "Teste withdraw",
      type: "withdraw" as OperationType,
      user_id: user.id,
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should be able to create a deposit statement", async () => {
    const user = await createUserUseCase.execute({
      email: "jenajilod@ruuz.gy",
      name: "Dennis Poole",
      password: "12345",
    });

    const statement = await createStatementUseCase.execute({
      amount: 12345,
      description: "Teste deposit",
      type: "deposit" as OperationType,
      user_id: user.id,
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should not be able to withdraw an amount smaller than the user's balance", async () => {
    const user = await createUserUseCase.execute({
      email: "jenajilod@ruuz.gy",
      name: "Dennis Poole",
      password: "12345",
    });

    await expect(
      createStatementUseCase.execute({
        amount: 123450,
        description: "Teste withdraw",
        type: "withdraw" as OperationType,
        user_id: user.id,
      })
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });

  it("Should not be able to statement a operation with an inexistent user", async () => {
    await expect(
      createStatementUseCase.execute({
        amount: 123450,
        description: "Teste withdraw",
        type: "withdraw" as OperationType,
        user_id: "123123",
      })
    ).rejects.toEqual(new CreateStatementError.UserNotFound());
  });
});
