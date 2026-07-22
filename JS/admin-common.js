// ====================== ADMIN-COMMON.JS ======================
// Lớp tích hợp ethers.js dùng chung cho toàn bộ khu vực Admin.
// Thay thế hoàn toàn lớp localStorage mô phỏng (BVStore) bằng các lời gọi
// thật tới Smart Contract VotingSystem đã deploy (xem JS/config.js).
import {
  connectWallet,
  disconnectWallet,
  getContract,
  getProvider,
  getCurrentAddress,
  isAdmin,
  addAccountChangeListener,
} from "./blockchain.js";

// ============================ Tiện ích chung ============================
export function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

export function nowLabel() {
  return new Date().toLocaleString("vi-VN");
}

// draft = Pending(0), registration = 1, verification = 2, voting = 3, ended = 4
export const STATUS_KEYS = [
  "draft",
  "registration",
  "verification",
  "voting",
  "ended",
];

export function statusKeyFromEnum(statusValue) {
  const idx = Number(statusValue);
  return STATUS_KEYS[idx] || "draft";
}

export function statusLabel(key) {
  return (
    {
      draft: "Chưa khởi tạo",
      registration: "Đang mở đăng ký",
      verification: "Đang xác thực",
      voting: "Đang bỏ phiếu",
      ended: "Đã kết thúc",
    }[key] || key
  );
}

// ============================ Trạng thái trang ============================
const state = {
  address: null,
  connected: false,
  isAdmin: false,
};

function renderWallet() {
  const addrEl = document.getElementById("wallet-address");
  const statusEl = document.getElementById("wallet-status");
  const badgeEl = document.getElementById("wallet-badge");
  const connectBtn = document.getElementById("connect-wallet-btn");
  const dotHeader = document.getElementById("system-status-dot-header");

  if (addrEl) {
    addrEl.textContent = state.connected ? shortAddr(state.address) : "Chưa kết nối";
    addrEl.classList.remove("hidden");
  }
  if (statusEl) {
    if (state.connected && state.isAdmin) {
      statusEl.textContent = "Connected (Admin)";
      statusEl.className = "text-[11px] text-emerald-600 font-medium";
    } else if (state.connected && !state.isAdmin) {
      statusEl.textContent = "Ví không có quyền Admin";
      statusEl.className = "text-[11px] text-error font-medium";
    } else {
      statusEl.textContent = "Chưa kết nối";
      statusEl.className = "text-[11px] text-on-surface-variant font-medium";
    }
  }
  if (badgeEl) badgeEl.classList.toggle("opacity-50", !state.connected);
  if (dotHeader) {
    dotHeader.className = `w-2 h-2 rounded-full ${
      state.connected && state.isAdmin ? "bg-emerald-500" : "bg-outline"
    }`;
  }
  if (connectBtn) {
    connectBtn.textContent = state.connected
      ? shortAddr(state.address)
      : "Kết nối ví Admin";
  }
}

export function guardAdmin() {
  const warningEl = document.getElementById("admin-guard-warning");
  const isOk = state.connected && state.isAdmin;
  if (warningEl) warningEl.classList.toggle("hidden", isOk);
  document.querySelectorAll("[data-admin-only]").forEach((el) => {
    el.disabled = !isOk;
    el.classList.toggle("opacity-50", !isOk);
    el.classList.toggle("cursor-not-allowed", !isOk);
  });
  return isOk;
}

export function getState() {
  return state;
}

/**
 * Khởi tạo trang Admin: cố gắng khôi phục phiên kết nối MetaMask (nếu đã từng
 * cấp quyền), gắn sự kiện cho nút "Kết nối ví Admin", theo dõi accountsChanged
 * và gọi lại onChange(state) mỗi khi trạng thái thay đổi để trang tự render.
 */
export async function initAdminPage(onChange) {
  const connectBtn = document.getElementById("connect-wallet-btn");

  function applyResult(data) {
    if (data) {
      state.address = data.address;
      state.connected = true;
      state.isAdmin = data.isAdmin;
    } else {
      state.address = null;
      state.connected = false;
      state.isAdmin = false;
    }
    renderWallet();
    guardAdmin();
    if (onChange) onChange(state);
  }

  async function handleConnectClick() {
    const data = await connectWallet();
    if (!data) return;
    applyResult(data);
  }

  if (connectBtn) connectBtn.addEventListener("click", handleConnectClick);

  // Khôi phục phiên kết nối nếu MetaMask đã từng cấp quyền cho trang này
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts && accounts.length > 0) {
        const data = await connectWallet();
        applyResult(data);
      } else {
        applyResult(null);
      }
    } catch (e) {
      console.error(e);
      applyResult(null);
    }
  } else {
    applyResult(null);
  }

  addAccountChangeListener((data) => applyResult(data));

  return state;
}

export { getContract, getProvider, getCurrentAddress, isAdmin, disconnectWallet };

// ============================ Đọc dữ liệu từ Contract ============================
export async function fetchVoters(contract) {
  const addrs = await contract.getAllVoters();
  const list = await Promise.all(
    addrs.map(async (addr) => {
      const v = await contract.getVoter(addr);
      return {
        address: v.wallet,
        name: v.fullName,
        verified: v.verified,
        active: v.active,
      };
    }),
  );
  return list;
}

export async function fetchCandidates(contract) {
  const all = await contract.getAllCandidates();
  return all.map((c) => ({
    id: Number(c.id),
    name: c.fullName,
    wallet: c.wallet,
    desc: c.description,
    votes: Number(c.voteCount),
    verified: c.verified,
  }));
}

export async function fetchElections(contract) {
  const all = await contract.getAllElections();
  return all.map((e) => ({
    id: Number(e.id),
    title: e.title,
    description: e.description,
    status: statusKeyFromEnum(e.status),
    startTime: Number(e.startTime),
    endTime: Number(e.endTime),
  }));
}

/** Trả về cuộc bầu cử mới nhất (được xem là cuộc bầu cử "hiện hành" của demo). */
export async function fetchCurrentElection(contract) {
  const count = await contract.electionCount();
  if (count === 0n) return null;
  const id = count - 1n;
  const e = await contract.getElection(id);
  return {
    id: Number(e.id),
    title: e.title,
    description: e.description,
    status: statusKeyFromEnum(e.status),
    startTime: Number(e.startTime),
    endTime: Number(e.endTime),
  };
}

// ============================ Lịch sử giao dịch (từ Event Log) ============================
const EVENT_DEFS = [
  {
    name: "ElectionCreated",
    label: (a) => `Tạo cuộc bầu cử: ${a.title}`,
  },
  {
    name: "ElectionStatusChanged",
    label: (a) => `Chuyển trạng thái bầu cử #${a.electionId}: ${statusLabel(statusKeyFromEnum(a.status))}`,
  },
  {
    name: "VoterRegistered",
    label: (a) => `Thêm cử tri: ${a.fullName}`,
  },
  {
    name: "VoterVerified",
    label: (a) => `Xác thực cử tri: ${shortAddr(a.wallet)}`,
  },
  {
    name: "VoterDisabled",
    label: (a) => `Khóa quyền bỏ phiếu: ${shortAddr(a.wallet)}`,
  },
  {
    name: "VoterEnabled",
    label: (a) => `Mở quyền bỏ phiếu: ${shortAddr(a.wallet)}`,
  },
  {
    name: "CandidateAdded",
    label: (a) => `Thêm ứng viên: ${a.fullName}`,
  },
  {
    name: "CandidateVerified",
    label: (a) => `Xác thực ứng viên #${a.candidateId}`,
  },
  {
    name: "VoteCast",
    label: (a) => `Cử tri bỏ phiếu (cuộc bầu cử #${a.electionId})`,
  },
  {
    name: "OwnershipTransferred",
    label: () => `Chuyển quyền sở hữu hợp đồng`,
  },
];

/**
 * Xây dựng danh sách giao dịch on-chain (thật) bằng cách đọc toàn bộ event log
 * đã phát ra từ Smart Contract, sắp xếp theo block giảm dần (mới nhất trước).
 */
export async function fetchAllTransactions(contract, provider, limit = 200) {
  const logsPerEvent = await Promise.all(
    EVENT_DEFS.map(async (def) => {
      try {
        const filter = contract.filters[def.name]();
        const logs = await contract.queryFilter(filter, 0, "latest");
        return logs.map((log) => ({ log, def }));
      } catch (e) {
        console.warn("Không đọc được event", def.name, e);
        return [];
      }
    }),
  );

  let entries = logsPerEvent.flat();
  entries.sort((a, b) => {
    if (b.log.blockNumber !== a.log.blockNumber)
      return b.log.blockNumber - a.log.blockNumber;
    return b.log.index - a.log.index;
  });
  entries = entries.slice(0, limit);

  const blockCache = new Map();
  const txCache = new Map();

  const results = await Promise.all(
    entries.map(async ({ log, def }) => {
      let block = blockCache.get(log.blockNumber);
      if (!block) {
        block = await provider.getBlock(log.blockNumber);
        blockCache.set(log.blockNumber, block);
      }
      let tx = txCache.get(log.transactionHash);
      if (!tx) {
        tx = await provider.getTransaction(log.transactionHash);
        txCache.set(log.transactionHash, tx);
      }
      return {
        hash: log.transactionHash,
        wallet: tx ? tx.from : null,
        block: log.blockNumber,
        time: block ? new Date(block.timestamp * 1000).toLocaleString("vi-VN") : "",
        status: "success",
        type: def.label(log.args),
      };
    }),
  );

  return results;
}
