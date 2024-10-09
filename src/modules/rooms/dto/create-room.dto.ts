import { IsString, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  title: string;

  @IsString()
  problemLink: string;

  @IsString()
  description: string;

  @IsString()
  difficulty: 'easy' | 'medium' | 'hard';

  @IsString()
  problemType: string;

  @IsNumber()
  @Min(5)
  @Max(60)
  timeLimit: number;

  @IsBoolean()
  isPublic: boolean;
}
