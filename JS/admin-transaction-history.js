tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-primary-fixed-variant": "#3323cc",
        "surface-dim": "#d3daea",
        "surface-container-lowest": "#ffffff",
        "on-tertiary-fixed-variant": "#7b2f00",
        secondary: "#0058be",
        "on-primary-fixed": "#0f0069",
        "surface-container-highest": "#dce2f3",
        "outline-variant": "#c7c4d8",
        "surface-container-low": "#f0f3ff",
        "inverse-on-surface": "#ebf1ff",
        error: "#ba1a1a",
        "on-error-container": "#93000a",
        "inverse-primary": "#c3c0ff",
        "secondary-fixed-dim": "#adc6ff",
        "surface-container-high": "#e2e8f8",
        "on-secondary": "#ffffff",
        primary: "#3525cd",
        "on-primary": "#ffffff",
        "on-tertiary-fixed": "#351000",
        "tertiary-fixed": "#ffdbcc",
        "on-secondary-container": "#fefcff",
        "primary-fixed": "#e2dfff",
        "surface-bright": "#f9f9ff",
        "secondary-container": "#2170e4",
        "surface-container": "#e7eefe",
        "on-primary-container": "#dad7ff",
        "on-tertiary": "#ffffff",
        "error-container": "#ffdad6",
        outline: "#777587",
        "on-secondary-fixed": "#001a42",
        "surface-variant": "#dce2f3",
        "primary-container": "#4f46e5",
        "inverse-surface": "#2a313d",
        "tertiary-fixed-dim": "#ffb695",
        "primary-fixed-dim": "#c3c0ff",
        tertiary: "#7e3000",
        background: "#f9f9ff",
        "on-tertiary-container": "#ffd2be",
        "secondary-fixed": "#d8e2ff",
        surface: "#f9f9ff",
        "on-error": "#ffffff",
        "on-background": "#151c27",
        "tertiary-container": "#a44100",
        "on-secondary-fixed-variant": "#004395",
        "on-surface": "#151c27",
        "surface-tint": "#4d44e3",
        "on-surface-variant": "#464555",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        md: "16px",
        xs: "4px",
        lg: "24px",
        gutter: "20px",
        "container-max": "1200px",
        sm: "8px",
        base: "4px",
        xl: "40px",
      },
      fontFamily: {
        "mono-label": ["Inter"],
        "label-md": ["Inter"],
        "headline-lg": ["Inter"],
        "body-md": ["Inter"],
        "headline-lg-mobile": ["Inter"],
        "display-lg": ["Inter"],
        "body-sm": ["Inter"],
        "body-lg": ["Inter"],
        "headline-md": ["Inter"],
      },
      fontSize: {
        "mono-label": [
          "13px",
          { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" },
        ],
        "label-md": [
          "14px",
          { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" },
        ],
        "headline-lg": [
          "32px",
          { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg-mobile": [
          "24px",
          { lineHeight: "32px", fontWeight: "600" },
        ],
        "display-lg": [
          "48px",
          { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
      },
    },
  },
};

/* =========================================================================
   BVStore — Lớp lưu trữ dữ liệu mô phỏng (localStorage) dùng chung cho toàn
   bộ khu vực Admin. Trong bản demo này dữ liệu được lưu tại trình duyệt để
   mô phỏng trạng thái Smart Contract (cử tri, ứng viên, cuộc bầu cử, giao
   dịch on-chain). Khi tích hợp thật, các hàm bên dưới chỉ cần thay bằng lời
   gọi ethers.js tới Smart Contract đã deploy trên Ganache.
   ========================================================================= */
const BV_KEY = "bv_voting_data";
// Địa chỉ ví được cấp quyền Admin (demo). Khi kết nối MetaMask, nếu địa chỉ
// trùng khớp (không phân biệt hoa/thường) thì tài khoản được coi là Admin.
const BV_ADMIN_ADDRESS = "0xa1b517e141F6d7BE60555dfaBCf27Fdc536C20AA";

function bvDefaultData() {
  return {
    admin: { address: null, connected: false, isAdmin: false },
    election: {
      name: "Bầu cử Hội đồng DAO 2025",
      description:
        "Quyết định về việc tài trợ 50,000 USDT cho các dự án Web3 tiềm năng.",
      startDate: "",
      endDate: "",
      // draft -> registration -> verification -> voting -> ended
      status: "draft",
    },
    voters: [
      {
        address: "0x82a1f0a1f0a1f0a1f0a1f0a1f0a1f0a1f0a1f0a1",
        name: "Cử tri 1",
        verified: false,
        locked: false,
        addedAt: Date.now(),
      },
      {
        address: "0x91b3e291b3e291b3e291b3e291b3e291b3e291b3",
        name: "Cử tri 2",
        verified: false,
        locked: false,
        addedAt: Date.now(),
      },
    ],
    candidates: [
      {
        id: 1,
        name: "Ứng viên 1",
        wallet: "0x55c29a4155c29a4155c29a4155c29a4155c29a4",
        desc: "Đại diện cộng đồng DAO với kinh nghiệm quản lý quỹ đầu tư số.",
        votes: 0,
        verified: false,
      },
      {
        id: 2,
        name: "Ứng viên 2",
        wallet: "0x12b3ff5412b3ff5412b3ff5412b3ff5412b3ff54",
        desc: "Chuyên gia công nghệ blockchain, nhiều năm phát triển hợp đồng thông minh.",
        votes: 0,
        verified: false,
      },
    ],
    transactions: [],
  };
}

function bvLoad() {
  try {
    const raw = localStorage.getItem(BV_KEY);
    if (!raw) {
      const init = bvDefaultData();
      localStorage.setItem(BV_KEY, JSON.stringify(init));
      return init;
    }
    return JSON.parse(raw);
  } catch (e) {
    const init = bvDefaultData();
    localStorage.setItem(BV_KEY, JSON.stringify(init));
    return init;
  }
}

function bvSave(data) {
  localStorage.setItem(BV_KEY, JSON.stringify(data));
}

function bvShortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function bvNow() {
  return new Date().toLocaleString("vi-VN");
}

// Ghi lại một "giao dịch" on-chain mô phỏng, dùng cho trang Lịch sử Blockchain
function bvAddTransaction(data, type, wallet, status) {
  const tx = {
    hash:
      "0x" +
      Array.from(
        { length: 64 },
        () => "0123456789abcdef"[Math.floor(Math.random() * 16)],
      ).join(""),
    wallet: wallet || data.admin.address || BV_ADMIN_ADDRESS,
    block: 18200000 + Math.floor(Math.random() * 9999),
    time: bvNow(),
    status: status || "success",
    type: type,
  };
  data.transactions.unshift(tx);
  bvSave(data);
  return tx;
}

/* ============================ Kết nối MetaMask ========================== */
async function bvConnectWallet() {
  const data = bvLoad();
  if (typeof window.ethereum === "undefined") {
    alert(
      "Không tìm thấy MetaMask. Vui lòng cài đặt tiện ích MetaMask và kết nối với mạng Ganache để tiếp tục.",
    );
    return null;
  }
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const address = accounts[0];
    data.admin.address = address;
    data.admin.connected = true;
    data.admin.isAdmin =
      address.toLowerCase() === BV_ADMIN_ADDRESS.toLowerCase();
    bvSave(data);
    bvRenderWallet(data);
    bvGuardAdmin(data);
    if (data.admin.isAdmin) {
      bvAddTransaction(data, "Kết nối ví Admin", address, "success");
    }
    return data.admin;
  } catch (err) {
    console.error("Kết nối ví thất bại:", err);
    alert("Kết nối ví thất bại hoặc bị từ chối. Vui lòng thử lại.");
    return null;
  }
}

// Hiển thị trạng thái ví lên header (áp dụng cho mọi trang admin)
function bvRenderWallet(data) {
  const addrEl = document.getElementById("wallet-address");
  const statusEl = document.getElementById("wallet-status");
  const badgeEl = document.getElementById("wallet-badge");
  const connectBtn = document.getElementById("connect-wallet-btn");

  if (addrEl) {
    addrEl.textContent = data.admin.connected
      ? bvShortAddr(data.admin.address)
      : "Chưa kết nối";
  }
  if (statusEl) {
    if (data.admin.connected && data.admin.isAdmin) {
      statusEl.textContent = "Connected (Admin)";
      statusEl.className = "text-[11px] text-emerald-600 font-medium";
    } else if (data.admin.connected && !data.admin.isAdmin) {
      statusEl.textContent = "Ví không có quyền Admin";
      statusEl.className = "text-[11px] text-error font-medium";
    } else {
      statusEl.textContent = "Chưa kết nối";
      statusEl.className = "text-[11px] text-on-surface-variant font-medium";
    }
  }
  if (badgeEl) {
    badgeEl.classList.toggle("opacity-50", !data.admin.connected);
  }
  if (connectBtn) {
    connectBtn.textContent = data.admin.connected
      ? bvShortAddr(data.admin.address)
      : "Kết nối ví Admin";
  }
}

// Chặn thao tác nếu ví chưa kết nối / không có quyền Admin
function bvGuardAdmin(data) {
  const warningEl = document.getElementById("admin-guard-warning");
  const isOk = data.admin.connected && data.admin.isAdmin;
  if (warningEl) warningEl.classList.toggle("hidden", isOk);
  document.querySelectorAll("[data-admin-only]").forEach((el) => {
    el.disabled = !isOk;
    el.classList.toggle("opacity-50", !isOk);
    el.classList.toggle("cursor-not-allowed", !isOk);
  });
  return isOk;
}

document.addEventListener("DOMContentLoaded", () => {
  const data = bvLoad();
  bvRenderWallet(data);
  bvGuardAdmin(data);
  const connectBtn = document.getElementById("connect-wallet-btn");
  if (connectBtn) connectBtn.addEventListener("click", bvConnectWallet);
});

/* ====================== Trang Lịch sử Blockchain ============================
   Hiển thị: Transaction Hash, Wallet, Block Number, Time, Status.
   ========================================================================= */

function bvStatusPill(status) {
  if (status === "success") {
    return `<span class="inline-flex items-center gap-1 px-sm py-xs bg-emerald-100 text-emerald-700 rounded-full font-label-md text-[12px]"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-status"></span>Thành công</span>`;
  }
  if (status === "pending") {
    return `<span class="inline-flex items-center gap-1 px-sm py-xs bg-amber-100 text-amber-700 rounded-full font-label-md text-[12px]"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-status"></span>Đang xử lý</span>`;
  }
  return `<span class="inline-flex items-center gap-1 px-sm py-xs bg-error-container text-on-error-container rounded-full font-label-md text-[12px]"><span class="w-1.5 h-1.5 rounded-full bg-error"></span>Thất bại</span>`;
}

function bvRenderTransactions() {
  const data = bvLoad();
  const tbody = document.getElementById("tx-table-body");
  const emptyState = document.getElementById("tx-empty-state");
  if (!tbody) return;

  const term = (document.getElementById("tx-search")?.value || "")
    .toLowerCase()
    .trim();
  const filtered = data.transactions.filter(
    (tx) =>
      tx.hash.toLowerCase().includes(term) ||
      tx.wallet.toLowerCase().includes(term) ||
      tx.type.toLowerCase().includes(term),
  );

  document.getElementById("tx-count") &&
    (document.getElementById("tx-count").textContent =
      `Hiển thị ${filtered.length} trên tổng số ${data.transactions.length} giao dịch`);

  if (emptyState) emptyState.classList.toggle("hidden", filtered.length > 0);

  tbody.innerHTML = filtered
    .map(
      (tx) => `
    <tr class="hover:bg-surface-container-lowest transition-colors">
      <td class="px-lg py-md">
        <p class="font-mono-label text-mono-label text-primary">${tx.hash.slice(0, 10)}...${tx.hash.slice(-6)}</p>
        <p class="font-body-sm text-body-sm text-on-surface-variant">${tx.type}</p>
      </td>
      <td class="px-lg py-md font-mono-label text-mono-label text-on-surface">${bvShortAddr(tx.wallet)}</td>
      <td class="px-lg py-md font-mono-label text-mono-label text-on-surface-variant">#${tx.block.toLocaleString("vi-VN")}</td>
      <td class="px-lg py-md font-body-sm text-body-sm text-on-surface-variant">${tx.time}</td>
      <td class="px-lg py-md text-center">${bvStatusPill(tx.status)}</td>
    </tr>`,
    )
    .join("");

  // Thống kê tổng quan
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  set("tx-stat-total", data.transactions.length.toLocaleString("vi-VN"));
  set(
    "tx-stat-success",
    data.transactions
      .filter((t) => t.status === "success")
      .length.toLocaleString("vi-VN"),
  );
  set("tx-stat-block", "#" + (18200000 + data.transactions.length));
}

document.addEventListener("DOMContentLoaded", () => {
  bvRenderTransactions();
  const search = document.getElementById("tx-search");
  if (search) search.addEventListener("input", bvRenderTransactions);
  const refreshBtn = document.getElementById("tx-refresh-btn");
  if (refreshBtn) refreshBtn.addEventListener("click", bvRenderTransactions);

  document.querySelectorAll("#tx-table-body").forEach(() => {});
});
