import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { IStatementsRepository } from "./../../repositories/IStatementsRepository";
import { IUsersRepository } from "./../../../users/repositories/IUsersRepository";
import { CreateStatementUseCase } from "./../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "./../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "./../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";

let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("List statements", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to get a statement by id", async () => {
    const user = await createUserUseCase.execute({
      email: "jenajilod@ruuz.gy",
      name: "Dennis Poole",
      password: "12345",
    });

    const newStatement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 12345,
      type: "deposit" as OperationType,
      description: "Deposit test",
    });

    const statement = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: newStatement.id,
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should not be able to get an inexistent statement", async () => {
    const user = await createUserUseCase.execute({
      email: "jenajilod@ruuz.gy",
      name: "Dennis Poole",
      password: "12345",
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "abc",
      })
    ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
  });

  it("Should not be able to get an statement with inexistent user", async () => {
    const user = await createUserUseCase.execute({
      email: "jenajilod@ruuz.gy",
      name: "Dennis Poole",
      password: "12345",
    });

    const newStatement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 12345,
      type: "deposit" as OperationType,
      description: "Deposit test",
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: "USER_TESTT_ID",
        statement_id: newStatement.id,
      })
    ).rejects.toEqual(new GetStatementOperationError.UserNotFound());
  });
});
