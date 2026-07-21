export const CONTRACT_ABI = [
  [
    {
      inputs: [
        {
          internalType: "string",
          name: "_fullName",
          type: "string",
        },
        {
          internalType: "address",
          name: "_wallet",
          type: "address",
        },
        {
          internalType: "string",
          name: "_description",
          type: "string",
        },
      ],
      name: "addCandidate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "candidateId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "fullName",
          type: "string",
        },
      ],
      name: "CandidateAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "candidateId",
          type: "uint256",
        },
      ],
      name: "CandidateVerified",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_electionId",
          type: "uint256",
        },
        {
          internalType: "enum VotingSystem.ElectionStatus",
          name: "_status",
          type: "uint8",
        },
      ],
      name: "changeElectionStatus",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_title",
          type: "string",
        },
        {
          internalType: "string",
          name: "_description",
          type: "string",
        },
      ],
      name: "createElection",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_wallet",
          type: "address",
        },
      ],
      name: "disableVoter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "electionId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "title",
          type: "string",
        },
      ],
      name: "ElectionCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "electionId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "enum VotingSystem.ElectionStatus",
          name: "status",
          type: "uint8",
        },
      ],
      name: "ElectionStatusChanged",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_wallet",
          type: "address",
        },
      ],
      name: "enableVoter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_fullName",
          type: "string",
        },
        {
          internalType: "address",
          name: "_wallet",
          type: "address",
        },
      ],
      name: "registerVoter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_candidateId",
          type: "uint256",
        },
      ],
      name: "verifyCandidate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_wallet",
          type: "address",
        },
      ],
      name: "verifyVoter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_electionId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_candidateId",
          type: "uint256",
        },
      ],
      name: "vote",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "electionId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "candidateId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "voter",
          type: "address",
        },
      ],
      name: "VoteCast",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "wallet",
          type: "address",
        },
      ],
      name: "VoterDisabled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "wallet",
          type: "address",
        },
      ],
      name: "VoterEnabled",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "fullName",
          type: "string",
        },
      ],
      name: "VoterRegistered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "wallet",
          type: "address",
        },
      ],
      name: "VoterVerified",
      type: "event",
    },
    {
      inputs: [],
      name: "candidateCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "candidates",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "fullName",
          type: "string",
        },
        {
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          internalType: "string",
          name: "description",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "voteCount",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "verified",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "candidateWallets",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "electionCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "elections",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "title",
          type: "string",
        },
        {
          internalType: "string",
          name: "description",
          type: "string",
        },
        {
          internalType: "enum VotingSystem.ElectionStatus",
          name: "status",
          type: "uint8",
        },
        {
          internalType: "uint256",
          name: "startTime",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "endTime",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllCandidates",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "fullName",
              type: "string",
            },
            {
              internalType: "address",
              name: "wallet",
              type: "address",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "voteCount",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "verified",
              type: "bool",
            },
          ],
          internalType: "struct VotingSystem.CandidateData[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllElections",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "title",
              type: "string",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "enum VotingSystem.ElectionStatus",
              name: "status",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "startTime",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "endTime",
              type: "uint256",
            },
          ],
          internalType: "struct VotingSystem.ElectionData[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getAllVoters",
      outputs: [
        {
          internalType: "address[]",
          name: "",
          type: "address[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_candidateId",
          type: "uint256",
        },
      ],
      name: "getCandidate",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "fullName",
              type: "string",
            },
            {
              internalType: "address",
              name: "wallet",
              type: "address",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "voteCount",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "verified",
              type: "bool",
            },
          ],
          internalType: "struct VotingSystem.CandidateData",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_electionId",
          type: "uint256",
        },
      ],
      name: "getElection",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "title",
              type: "string",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
            {
              internalType: "enum VotingSystem.ElectionStatus",
              name: "status",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "startTime",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "endTime",
              type: "uint256",
            },
          ],
          internalType: "struct VotingSystem.ElectionData",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_wallet",
          type: "address",
        },
      ],
      name: "getVoter",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "fullName",
              type: "string",
            },
            {
              internalType: "address",
              name: "wallet",
              type: "address",
            },
            {
              internalType: "bool",
              name: "verified",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "active",
              type: "bool",
            },
            {
              internalType: "bool",
              name: "voted",
              type: "bool",
            },
          ],
          internalType: "struct VotingSystem.VoterInfo",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getWinner",
      outputs: [
        {
          internalType: "uint256",
          name: "winnerId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "maxVotes",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_wallet",
          type: "address",
        },
      ],
      name: "hasVoted",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_wallet",
          type: "address",
        },
      ],
      name: "isActive",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_wallet",
          type: "address",
        },
      ],
      name: "isVerified",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalVoters",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalVotes",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "voterList",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "voters",
      outputs: [
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "fullName",
          type: "string",
        },
        {
          internalType: "address",
          name: "wallet",
          type: "address",
        },
        {
          internalType: "bool",
          name: "verified",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "active",
          type: "bool",
        },
        {
          internalType: "bool",
          name: "voted",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
];
