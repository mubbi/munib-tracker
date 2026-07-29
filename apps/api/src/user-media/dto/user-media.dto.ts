import { ApiProperty } from "@nestjs/swagger";

export class UserMediaDto {
  @ApiProperty({ format: "uuid" })
  id!: string;

  @ApiProperty({ example: "image/jpeg" })
  mimeType!: string;

  @ApiProperty()
  filename!: string;

  @ApiProperty({ example: 102400 })
  sizeBytes!: number;

  @ApiProperty({
    description: "Authenticated content URL (requires bearer token on GET)",
    example: "/api/v1/user-media/…/content",
  })
  contentPath!: string;

  @ApiProperty()
  createdAt!: string;
}

export class UserMediaListResponseDto {
  @ApiProperty({ type: [UserMediaDto] })
  items!: UserMediaDto[];
}
