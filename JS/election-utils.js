// ====================== ELECTION-UTILS.JS ======================
// Các hàm tiện ích dùng chung để đọc dữ liệu Election / Candidate / Voter
// trực tiếp từ Smart Contract (VotingSystem.sol) bằng ethers.js, và để gom
// lịch sử các event on-chain thành danh sách giao dịch hiển thị trên UI.
//
// Toàn bộ hàm ở đây là READ-ONLY (không tốn gas, không cần MetaMask ký).

export const STATUS_KEYS = [
  "draft", // Pending
  "registration", // Registration
  "verification", // Verification
  "voting", // Voting
  "ended", // Ended
];

export const STATUS_LABELS = {
  draft: "Chưa khởi tạo",
  registration: "Đang mở đăng ký",
  verification: "Đang xác thực",
  voting: "Đang bỏ phiếu",
  ended: "Đã kết thúc",
};

export function statusKeyFromEnum(statusEnum) {
  return STATUS_KEYS[Number(statusEnum)] || "draft";
}

export function statusEnumFromKey(key) {
  return STATUS_KEYS.indexOf(key);
}

export function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export function nowStr() {
  return new Date().toLocaleString("vi-VN");
}

/**
 * Cuộc bầu cử "đang hoạt động" = cuộc bầu cử mới nhất được Admin tạo.
 * Giao diện demo này quản lý MỘT cuộc bầu cử tại một thời điểm, đi theo đúng
 * luồng: Tạo bầu cử -> Mở đăng ký -> Mở xác thực -> Mở bỏ phiếu -> Kết thúc.
 * Trả về null nếu chưa có cuộc bầu cử nào được tạo.
 */
export async function getActiveElectionId(contract) {
  const count = await contract.electionCount();
  if (count === 0n) return null;
  return count - 1n;
}

export async function getElectionPlain(contract, electionId) {
  const e = await contract.getElection(electionId);
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    statusEnum: Number(e.status),
    statusKey: statusKeyFromEnum(e.status),
    startTime: Number(e.startTime),
    endTime: Number(e.endTime),
  };
}

export async function getAllElectionsPlain(contract) {
  const all = await contract.getAllElections();
  return all.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    statusEnum: Number(e.status),
    statusKey: statusKeyFromEnum(e.status),
    startTime: Number(e.startTime),
    endTime: Number(e.endTime),
  }));
}

export async function getAllCandidatesPlain(contract) {
  const all = await contract.getAllCandidates();
  return all.map((c) => ({
    id: c.id,
    fullName: c.fullName,
    wallet: c.wallet,
    description: c.description,
    voteCount: Number(c.voteCount),
    verified: c.verified,
  }));
}

/** Danh sách ứng viên thuộc một cuộc bầu cử cụ thể. */
export async function getCandidatesForElection(contract, electionId) {
  const all = await getAllCandidatesPlain(contract);
  const flags = await Promise.all(
    all.map((c) => contract.isCandidateInElection(electionId, c.id)),
  );
  return all.filter((_, i) => flags[i]);
}

export async function getAllVotersPlain(contract) {
  const addresses = await contract.getAllVoters();
  const voters = await Promise.all(
    addresses.map(async (addr) => {
      const v = await contract.getVoter(addr);
      return {
        id: v.id,
        fullName: v.fullName,
        wallet: v.wallet,
        verified: v.verified,
        active: v.active,
      };
    }),
  );
  return voters;
}

/* ============================ LỊCH SỬ EVENT ============================ */

const EVENT_NAMES = [
  "VoterRegistered",
  "VoterVerified",
  "VoterDisabled",
  "VoterEnabled",
  "CandidateAdded",
  "CandidateVerified",
  "ElectionCreated",
  "ElectionStatusChanged",
  "VoteCast",
  "OwnershipTransferred",
];

const EVENT_LABELS = {
  VoterRegistered: "Thêm cử tri",
  VoterVerified: "Xác thực cử tri",
  VoterDisabled: "Khóa quyền bỏ phiếu",
  VoterEnabled: "Mở quyền bỏ phiếu",
  CandidateAdded: "Thêm ứng viên",
  CandidateVerified: "Xác thực ứng viên",
  ElectionCreated: "Tạo cuộc bầu cử",
  ElectionStatusChanged: "Chuyển trạng thái bầu cử",
  VoteCast: "Bỏ phiếu",
  OwnershipTransferred: "Chuyển quyền Admin",
};

/** Gom toàn bộ event của contract thành 1 danh sách, mới nhất trước. */
export async function fetchAllEvents(contract, limit = 200) {
  const provider = contract.runner?.provider || contract.provider;

  const latestBlock = await provider.getBlockNumber();

  // Đặt block deploy của VotingSystem tại đây
  const DEPLOY_BLOCK = 11320000;

  const CHUNK_SIZE = 9000;
  const allEvents = [];

  for (
    let fromBlock = DEPLOY_BLOCK;
    fromBlock <= latestBlock;
    fromBlock += CHUNK_SIZE
  ) {
    const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock);

    const results = await Promise.all(
      EVENT_NAMES.map(async (name) => {
        try {
          const filter = contract.filters[name]();

          return await contract.queryFilter(filter, fromBlock, toBlock);
        } catch (error) {
          console.error(`[ERROR] ${name}:`, error);

          return [];
        }
      }),
    );

    allEvents.push(...results.flat());
  }

  allEvents.sort(
    (a, b) => b.blockNumber - a.blockNumber || (b.index ?? 0) - (a.index ?? 0),
  );

  return limit ? allEvents.slice(0, limit) : allEvents;
}

/** Chuyển 1 event log thành bản ghi giao dịch dễ hiển thị (có gọi thêm RPC để lấy wallet + thời gian). */
export async function describeEvent(ev, provider) {
  const name = ev.fragment?.name || ev.eventName || "Không rõ";
  let wallet = null;
  try {
    const tx = await ev.getTransaction();
    wallet = tx?.from || null;
  } catch (e) {
    /* bỏ qua nếu không lấy được */
  }
  let time = "";
  try {
    const block = await provider.getBlock(ev.blockNumber);
    time = block
      ? new Date(Number(block.timestamp) * 1000).toLocaleString("vi-VN")
      : "";
  } catch (e) {
    /* bỏ qua nếu không lấy được */
  }
  return {
    type: EVENT_LABELS[name] || name,
    hash: ev.transactionHash,
    wallet,
    block: ev.blockNumber,
    time,
    status: "success",
  };
}
export async function fetchVoteEvents(contract, fromBlock = null) {
  const provider = contract.runner?.provider || contract.provider;

  const latestBlock = await provider.getBlockNumber();

  const CHUNK_SIZE = 9000;

  if (fromBlock === null) {
    fromBlock = latestBlock - CHUNK_SIZE;
  }

  const allEvents = [];

  for (let start = fromBlock; start <= latestBlock; start += CHUNK_SIZE) {
    const end = Math.min(start + CHUNK_SIZE - 1, latestBlock);

    const events = await contract.queryFilter(
      contract.filters.VoteCast(),
      start,
      end,
    );

    allEvents.push(...events);
  }

  return allEvents;
}
