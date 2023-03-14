import * as anchor from "@coral-xyz/anchor";
import { Program, Provider } from "@coral-xyz/anchor";
import { Custos, IDL } from "./idl";
import { PROGRAM_ID } from "./constants";

export const getProgram = (provider: Provider) => {
    const idl = IDL as anchor.Idl;
    const program = new anchor.Program(
        idl,
        PROGRAM_ID,
        provider
    ) as unknown as Program<Custos>;

    return program;
};