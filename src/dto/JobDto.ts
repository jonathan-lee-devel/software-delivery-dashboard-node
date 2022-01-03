import { BuildDto } from "./BuildDto";

export interface JobDto {
  name: string;
  builds: BuildDto[];
  lastSuccessfulBuild: BuildDto;
  lastFailedBuild: BuildDto;
}
