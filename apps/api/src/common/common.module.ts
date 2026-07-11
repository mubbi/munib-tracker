import { Global, Module } from "@nestjs/common";
import { AttachmentStorageService } from "./attachment-storage.service";

@Global()
@Module({
  providers: [AttachmentStorageService],
  exports: [AttachmentStorageService],
})
export class CommonModule {}
