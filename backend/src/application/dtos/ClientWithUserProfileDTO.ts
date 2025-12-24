import { UserDTO } from "./UserDTO"

export type ClientWithUserProfileDTO = {
  id: string,
  userId: string,
  user: UserDTO
}