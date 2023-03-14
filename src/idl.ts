export type Custos = {
    version: "0.1.0";
    name: "custos";
    instructions: [
      {
        name: "createDelegate";
        accounts: [
          {
            name: "authority";
            isMut: true;
            isSigner: true;
          },
          {
            name: "toDelegateAccount";
            isMut: false;
            isSigner: false;
          },
          {
            name: "delegateAccount";
            isMut: true;
            isSigner: false;
          },
          {
            name: "systemProgram";
            isMut: false;
            isSigner: false;
          }
        ];
        args: [];
      },
      {
        name: "revokeDelegate";
        accounts: [
          {
            name: "authority";
            isMut: true;
            isSigner: true;
          },
          {
            name: "delegateAccount";
            isMut: true;
            isSigner: false;
          }
        ];
        args: [];
      },
      {
        name: "createTokenDelegate";
        accounts: [
          {
            name: "authority";
            isMut: true;
            isSigner: true;
          },
          {
            name: "toDelegateAccount";
            isMut: false;
            isSigner: false;
          },
          {
            name: "delegateTokenAccount";
            isMut: true;
            isSigner: false;
          },
          {
            name: "mint";
            isMut: false;
            isSigner: false;
          },
          {
            name: "tokenAccount";
            isMut: false;
            isSigner: false;
          },
          {
            name: "systemProgram";
            isMut: false;
            isSigner: false;
          }
        ];
        args: [];
      },
      {
        name: "revokeTokenDelegate";
        accounts: [
          {
            name: "authority";
            isMut: false;
            isSigner: true;
          },
          {
            name: "delegateTokenAccount";
            isMut: true;
            isSigner: false;
          }
        ];
        args: [];
      }
    ];
    accounts: [
      {
        name: "delegateAccount";
        type: {
          kind: "struct";
          fields: [
            {
              name: "authority";
              type: "publicKey";
            },
            {
              name: "hotWallet";
              type: "publicKey";
            }
          ];
        };
      },
      {
        name: "delegateTokenAccount";
        type: {
          kind: "struct";
          fields: [
            {
              name: "authority";
              type: "publicKey";
            },
            {
              name: "hotWallet";
              type: "publicKey";
            },
            {
              name: "tokenAccount";
              type: "publicKey";
            }
          ];
        };
      }
    ];
  };
  
  export const IDL: Custos = {
    version: "0.1.0",
    name: "custos",
    instructions: [
      {
        name: "createDelegate",
        accounts: [
          {
            name: "authority",
            isMut: true,
            isSigner: true,
          },
          {
            name: "toDelegateAccount",
            isMut: false,
            isSigner: false,
          },
          {
            name: "delegateAccount",
            isMut: true,
            isSigner: false,
          },
          {
            name: "systemProgram",
            isMut: false,
            isSigner: false,
          },
        ],
        args: [],
      },
      {
        name: "revokeDelegate",
        accounts: [
          {
            name: "authority",
            isMut: true,
            isSigner: true,
          },
          {
            name: "delegateAccount",
            isMut: true,
            isSigner: false,
          },
        ],
        args: [],
      },
      {
        name: "createTokenDelegate",
        accounts: [
          {
            name: "authority",
            isMut: true,
            isSigner: true,
          },
          {
            name: "toDelegateAccount",
            isMut: false,
            isSigner: false,
          },
          {
            name: "delegateTokenAccount",
            isMut: true,
            isSigner: false,
          },
          {
            name: "mint",
            isMut: false,
            isSigner: false,
          },
          {
            name: "tokenAccount",
            isMut: false,
            isSigner: false,
          },
          {
            name: "systemProgram",
            isMut: false,
            isSigner: false,
          },
        ],
        args: [],
      },
      {
        name: "revokeTokenDelegate",
        accounts: [
          {
            name: "authority",
            isMut: false,
            isSigner: true,
          },
          {
            name: "delegateTokenAccount",
            isMut: true,
            isSigner: false,
          },
        ],
        args: [],
      },
    ],
    accounts: [
      {
        name: "delegateAccount",
        type: {
          kind: "struct",
          fields: [
            {
              name: "authority",
              type: "publicKey",
            },
            {
              name: "hotWallet",
              type: "publicKey",
            },
          ],
        },
      },
      {
        name: "delegateTokenAccount",
        type: {
          kind: "struct",
          fields: [
            {
              name: "authority",
              type: "publicKey",
            },
            {
              name: "hotWallet",
              type: "publicKey",
            },
            {
              name: "tokenAccount",
              type: "publicKey",
            },
          ],
        },
      },
    ],
  };
  