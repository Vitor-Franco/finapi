import { ShowUserProfileError } from "./ShowUserProfileError";
import { IUsersRepository } from "./../../repositories/IUsersRepository";
import { CreateUserUseCase } from "./../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

let inMemoryUsersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to get a profile", async () => {
    const createdUser = await createUserUseCase.execute({
      email: "jenajilod@ruuz.gy",
      name: "Dennis Poole",
      password: "12345",
    });

    const profile = await showUserProfileUseCase.execute(createdUser.id);

    expect(profile).toHaveProperty("id");
  });

  it("Should not be able to an inexistent profile", async () => {
    const user_id = "1293u9123";
    await expect(showUserProfileUseCase.execute(user_id)).rejects.toEqual(
      new ShowUserProfileError()
    );
  });
});
