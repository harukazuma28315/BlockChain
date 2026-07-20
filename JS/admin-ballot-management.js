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
        address: "0xbe35D98101e25E7670591e7394aD5d15E763197d",
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

/* ====================== Trang Quản lý cuộc bầu cử ==========================
   Chức năng: Tạo cuộc bầu cử. Việc chuyển trạng thái (Mở đăng ký / Mở xác
   thực / Mở bỏ phiếu / Kết thúc) được thực hiện tại trang "Điều khiển"
   (admin-system-control.html).
   ========================================================================= */

function bvStatusBadge(status) {
  const map = {
    draft: {
      text: "Chưa khởi tạo",
      cls: "bg-surface-container-high text-on-surface-variant",
    },
    registration: {
      text: "Đang mở đăng ký",
      cls: "bg-tertiary-fixed text-tertiary",
    },
    verification: {
      text: "Đang xác thực",
      cls: "bg-secondary-fixed text-secondary",
    },
    voting: { text: "Đang bỏ phiếu", cls: "bg-primary-fixed text-primary" },
    ended: {
      text: "Đã kết thúc",
      cls: "bg-surface-container-high text-on-surface-variant",
    },
  };
  const s = map[status] || map.draft;
  return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${s.cls} font-label-md text-[12px]"><span class="w-1.5 h-1.5 rounded-full bg-current"></span>${s.text}</span>`;
}

function bvRenderBallot() {
  const data = bvLoad();
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("bs-total-elections", "1");
  set("bs-total-candidates", data.candidates.length);
  set("bs-total-voters", data.voters.length);

  const row = document.getElementById("election-row");
  if (row) {
    row.innerHTML = `
      <td class="px-lg py-lg">
        <p class="font-label-md text-label-md text-on-surface">${data.election.name}</p>
        <p class="font-body-sm text-body-sm text-on-surface-variant max-w-md line-clamp-2">${data.election.description}</p>
      </td>
      <td class="px-lg py-lg">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[16px]">play_circle</span>
            <span class="font-mono-label text-mono-label">${data.election.startDate || "—"}</span>
          </div>
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[16px]">stop_circle</span>
            <span class="font-mono-label text-mono-label">${data.election.endDate || "—"}</span>
          </div>
        </div>
      </td>
      <td class="px-lg py-lg text-center">${bvStatusBadge(data.election.status)}</td>
      <td class="px-lg py-lg text-right">
        <a href="admin-system-control.html" class="p-2 hover:bg-primary-fixed rounded-lg transition-colors text-primary inline-flex" title="Điều khiển cuộc bầu cử">
          <span class="material-symbols-outlined">settings_input_component</span>
        </a>
      </td>`;
  }
}

function bvToggleModal() {
  const modal = document.getElementById("createModal");
  if (!modal) return;
  modal.classList.toggle("hidden");
  document.body.style.overflow = modal.classList.contains("hidden")
    ? "auto"
    : "hidden";
}

function bvCreateElection(event) {
  event.preventDefault();
  const data = bvLoad();
  if (!bvGuardAdmin(data)) {
    alert("Bạn cần kết nối ví Admin để tạo cuộc bầu cử.");
    return;
  }
  const name = document.getElementById("election-name-input").value.trim();
  const desc = document.getElementById("election-desc-input").value.trim();
  const start = document.getElementById("election-start-input").value;
  const end = document.getElementById("election-end-input").value;
  if (!name) {
    alert("Vui lòng nhập tên cuộc bầu cử.");
    return;
  }
  data.election = {
    name,
    description: desc,
    startDate: start,
    endDate: end,
    status: "draft",
  };
  bvAddTransaction(
    data,
    `Tạo cuộc bầu cử: ${name}`,
    data.admin.address,
    "success",
  );
  bvSave(data);
  bvToggleModal();
  bvRenderBallot();
}

document.addEventListener("DOMContentLoaded", () => {
  bvRenderBallot();
  const form = document.getElementById("create-election-form");
  if (form) form.addEventListener("submit", bvCreateElection);
  const openBtn = document.getElementById("open-create-modal-btn");
  if (openBtn) openBtn.addEventListener("click", bvToggleModal);
});
