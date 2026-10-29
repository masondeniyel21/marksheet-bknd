
import { Global, Module } from "@nestjs/common";
import { DB, db } from "./db.provider";

@Global()
@Module({
  providers: [
    {
      provide: DB,
      useValue: db,
    },
  ],
  exports: [DB],
})
export class DbModule {}
