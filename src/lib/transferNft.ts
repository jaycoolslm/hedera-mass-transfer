import {
  TransferTransaction,
  Client,
  AccountId,
  PrivateKey,
} from "@hashgraph/sdk";

import * as dotenv from "dotenv";

dotenv.config();

const accountId = AccountId.fromString(process.env.ACCOUNT_ID!);
const privateKey = PrivateKey.fromString(process.env.PRIVATE_KEY!);
const tokenId = "0.0.3105713";

export default async (receiver: string, serial: number, file: string) => {
  const client = Client.forMainnet().setOperator(accountId, privateKey);

  const tx = new TransferTransaction().addNftTransfer(
    tokenId,
    serial,
    accountId,
    receiver
  );

  try {
    const ex = await tx.execute(client);
    const rx = await ex.getReceipt(client);
    const { status } = rx;
    console.log("STATUS", status);
    return {
      status: status._code,
      file,
    };
  } catch (e) {
    return {
      status: 0,
      file,
    };
  }
};
