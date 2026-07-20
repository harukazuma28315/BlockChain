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

/* ======================== Trang Quản lý cử tri ============================
   Chức năng: Thêm cử tri, Xác thực cử tri, Khóa/Mở quyền bỏ phiếu.
   ========================================================================= */

function bvRenderVoters() {
  const data = bvLoad();
  const tbody = document.getElementById("voters-table-body");
  const emptyState = document.getElementById("voters-empty-state");
  if (!tbody) return;

  const term = (document.getElementById("voter-search")?.value || "")
    .toLowerCase()
    .trim();
  const filtered = data.voters.filter(
    (v) =>
      v.name.toLowerCase().includes(term) ||
      v.address.toLowerCase().includes(term),
  );

  document.getElementById("voters-count") &&
    (document.getElementById("voters-count").textContent =
      `Hiển thị ${filtered.length} trên tổng số ${data.voters.length} cử tri`);

  if (emptyState) emptyState.classList.toggle("hidden", filtered.length > 0);

  tbody.innerHTML = filtered
    .map(
      (v, idx) => `
    <tr class="hover:bg-surface-container-lowest transition-colors">
      <td class="px-lg py-md">
        <div class="flex items-center gap-md">
          <div class="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container">
            <span class="material-symbols-outlined text-[18px]">person</span>
          </div>
          <div>
            <p class="font-label-md text-label-md text-on-surface">${v.name}</p>
            <p class="font-mono-label text-mono-label text-on-surface-variant">${bvShortAddr(v.address)}</p>
          </div>
        </div>
      </td>
      <td class="px-lg py-md text-center">
        ${
          v.verified
            ? `<span class="inline-flex items-center gap-xs px-sm py-xs bg-secondary-fixed text-on-secondary-fixed rounded-full font-label-md text-label-md"><span class="w-2 h-2 rounded-full bg-primary"></span>Đã xác thực</span>`
            : `<span class="inline-flex items-center gap-xs px-sm py-xs bg-surface-variant text-on-surface-variant rounded-full font-label-md text-label-md"><span class="w-2 h-2 rounded-full bg-outline"></span>Chưa xác thực</span>`
        }
      </td>
      <td class="px-lg py-md text-center">
        ${
          v.locked
            ? `<span class="inline-flex items-center gap-xs px-sm py-xs bg-error-container/30 text-on-error-container rounded-full font-label-md text-label-md"><span class="material-symbols-outlined text-[14px]">lock</span>Đã khóa</span>`
            : `<span class="inline-flex items-center gap-xs px-sm py-xs bg-primary-fixed text-primary rounded-full font-label-md text-label-md"><span class="material-symbols-outlined text-[14px]">lock_open</span>Được phép bầu</span>`
        }
      </td>
      <td class="px-lg py-md text-right">
        <div class="flex items-center justify-end gap-sm">
          <button data-admin-only ${v.verified ? "disabled" : ""} onclick="bvVerifyVoter(${idx})"
            class="p-sm text-on-surface-variant hover:text-primary hover:bg-primary-fixed rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Xác thực cử tri">
            <span class="material-symbols-outlined">how_to_reg</span>
          </button>
          <button data-admin-only onclick="bvToggleLockVoter(${idx})"
            class="p-sm text-on-surface-variant hover:text-amber-600 hover:bg-amber-100/50 rounded-lg transition-all"
            title="${v.locked ? "Mở quyền bỏ phiếu" : "Khóa quyền bỏ phiếu"}">
            <span class="material-symbols-outlined">${v.locked ? "lock_open" : "lock"}</span>
          </button>
          <button data-admin-only onclick="bvDeleteVoter(${idx})"
            class="p-sm text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-all"
            title="Xóa cử tri">
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </td>
    </tr>`,
    )
    .join("");

  bvGuardAdmin(data);
}

function bvAddVoter(event) {
  event.preventDefault();
  const data = bvLoad();
  if (!bvGuardAdmin(data)) {
    alert("Bạn cần kết nối ví Admin để thực hiện thao tác này.");
    return;
  }
  const name = document.getElementById("voter-name-input").value.trim();
  const address = document.getElementById("voter-address-input").value.trim();
  if (!name || !address) {
    alert("Vui lòng nhập đầy đủ Họ tên và Địa chỉ ví.");
    return;
  }
  if (!/^0x[a-fA-F0-9]{6,64}$/.test(address)) {
    alert("Địa chỉ ví không hợp lệ. Vui lòng nhập đúng định dạng 0x...");
    return;
  }
  if (
    data.voters.some((v) => v.address.toLowerCase() === address.toLowerCase())
  ) {
    alert("Địa chỉ ví này đã có trong danh sách cử tri.");
    return;
  }
  data.voters.push({
    address,
    name,
    verified: false,
    locked: false,
    addedAt: Date.now(),
  });
  bvAddTransaction(data, `Thêm cử tri: ${name}`, data.admin.address, "success");
  bvSave(data);
  bvToggleModal("add-voter-modal");
  document.getElementById("add-voter-form").reset();
  bvRenderVoters();
}

function bvVerifyVoter(idx) {
  const data = bvLoad();
  if (!bvGuardAdmin(data)) return;
  const voter = data.voters[idx];
  voter.verified = true;
  bvAddTransaction(
    data,
    `Xác thực cử tri: ${voter.name}`,
    data.admin.address,
    "success",
  );
  bvSave(data);
  bvRenderVoters();
}

function bvToggleLockVoter(idx) {
  const data = bvLoad();
  if (!bvGuardAdmin(data)) return;
  const voter = data.voters[idx];
  voter.locked = !voter.locked;
  bvAddTransaction(
    data,
    `${voter.locked ? "Khóa" : "Mở"} quyền bỏ phiếu: ${voter.name}`,
    data.admin.address,
    "success",
  );
  bvSave(data);
  bvRenderVoters();
}

function bvDeleteVoter(idx) {
  const data = bvLoad();
  if (!bvGuardAdmin(data)) return;
  const voter = data.voters[idx];
  if (!confirm(`Xóa cử tri "${voter.name}" khỏi danh sách?`)) return;
  data.voters.splice(idx, 1);
  bvSave(data);
  bvRenderVoters();
}

function bvToggleModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  const content = modal.querySelector(":scope > div");
  if (modal.classList.contains("hidden")) {
    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.remove("opacity-0");
      content?.classList.remove("scale-95");
      content?.classList.add("scale-100");
    }, 10);
  } else {
    modal.classList.add("opacity-0");
    content?.classList.remove("scale-100");
    content?.classList.add("scale-95");
    setTimeout(() => modal.classList.add("hidden"), 300);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  bvRenderVoters();
  const form = document.getElementById("add-voter-form");
  if (form) form.addEventListener("submit", bvAddVoter);
  const search = document.getElementById("voter-search");
  if (search) search.addEventListener("input", bvRenderVoters);
});

// Đóng modal khi bấm ra ngoài
window.addEventListener("click", (event) => {
  const modal = document.getElementById("add-voter-modal");
  if (modal && event.target === modal) bvToggleModal("add-voter-modal");
});
