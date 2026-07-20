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

/* ========================= Trang Điều khiển =================================
   Chức năng: Mở đăng ký -> Mở xác thực -> Mở bỏ phiếu -> Kết thúc bỏ phiếu.
   Đây là luồng trạng thái (state machine) của cuộc bầu cử hiện tại.
   ========================================================================= */

const BV_STAGES = [
  {
    key: "registration",
    label: "Mở đăng ký",
    icon: "how_to_reg",
    desc: "Cho phép cử tri và ứng viên đăng ký tham gia cuộc bầu cử.",
  },
  {
    key: "verification",
    label: "Mở xác thực",
    icon: "verified_user",
    desc: "Admin xác thực danh sách cử tri và ứng viên hợp lệ.",
  },
  {
    key: "voting",
    label: "Mở bỏ phiếu",
    icon: "how_to_vote",
    desc: "Kích hoạt hợp đồng thông minh, cho phép cử tri bỏ phiếu.",
  },
  {
    key: "ended",
    label: "Kết thúc bỏ phiếu",
    icon: "stop_circle",
    desc: "Đóng cổng bình chọn và chốt kết quả cuối cùng trên chuỗi.",
  },
];

function bvStageIndex(status) {
  const order = ["draft", "registration", "verification", "voting", "ended"];
  return order.indexOf(status);
}

function bvRenderControl() {
  const data = bvLoad();
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set("election-name-display", data.election.name);
  const statusText = {
    draft: "⚪ Chưa khởi tạo",
    registration: "🟠 Đang mở đăng ký",
    verification: "🔵 Đang xác thực",
    voting: "🟢 Đang bỏ phiếu",
    ended: "⚫ Đã kết thúc",
  }[data.election.status];
  set("current-status-label", statusText);

  const totalVotes = data.candidates.reduce((s, c) => s + (c.votes || 0), 0);
  const turnout = data.voters.length
    ? ((totalVotes / data.voters.length) * 100).toFixed(1)
    : "0.0";
  set("rt-total-votes", totalVotes.toLocaleString("vi-VN"));
  set("rt-turnout", `${turnout}%`);
  set("rt-block", "#" + (18200000 + data.transactions.length));

  const progressMap = {
    draft: 5,
    registration: 30,
    verification: 55,
    voting: 80,
    ended: 100,
  };
  const progressEl = document.getElementById("stage-progress-bar");
  const progressLabel = document.getElementById("stage-progress-label");
  const pct = progressMap[data.election.status] ?? 5;
  if (progressEl) progressEl.style.width = pct + "%";
  if (progressLabel) progressLabel.textContent = pct + "% hoàn thành";

  // Vẽ 4 giai đoạn điều khiển
  const stagesEl = document.getElementById("stage-controls");
  const currentIdx = bvStageIndex(data.election.status);
  if (stagesEl) {
    stagesEl.innerHTML = BV_STAGES.map((stage, i) => {
      const stageIdx = i + 1; // draft=0
      const isDone =
        stageIdx < currentIdx ||
        (data.election.status === "ended" && stageIdx <= currentIdx);
      const isCurrent = stageIdx === currentIdx;
      const isNext = stageIdx === currentIdx + 1;
      const isLocked = !isNext && !isCurrent && !isDone;
      const isEndedStage = stage.key === "ended";

      let btnHtml;
      if (isDone && !isCurrent) {
        btnHtml = `<button disabled class="w-full py-md bg-primary-fixed text-primary font-label-md text-label-md rounded-xl flex items-center justify-center gap-sm cursor-default">
            <span class="material-symbols-outlined">check_circle</span> Đã hoàn tất</button>`;
      } else if (isNext) {
        btnHtml = `<button data-admin-only onclick="bvSetStage('${stage.key}')" class="w-full py-md ${isEndedStage ? "bg-error text-on-error hover:bg-[#a11717]" : "bg-primary text-on-primary hover:bg-on-primary-fixed-variant"} font-label-md text-label-md rounded-xl active:scale-95 transition-all shadow-md flex items-center justify-center gap-sm">
            <span class="material-symbols-outlined">${stage.icon}</span> ${stage.label}</button>`;
      } else {
        btnHtml = `<button disabled class="w-full py-md bg-outline-variant text-on-surface-variant font-label-md text-label-md rounded-xl cursor-not-allowed flex items-center justify-center gap-sm">
            <span class="material-symbols-outlined">${stage.icon}</span> ${stage.label}</button>`;
      }

      return `
      <div class="p-lg ${isEndedStage ? "bg-surface border-2 border-error-container" : "bg-surface-container-low border border-outline-variant"} rounded-xl flex flex-col justify-between ${isLocked ? "opacity-60" : ""}">
        <div>
          <div class="flex justify-between items-start mb-xs">
            <h3 class="font-label-md text-label-md">Giai đoạn ${stageIdx}: ${stage.label}</h3>
            ${isEndedStage ? '<span class="px-sm py-[2px] bg-error-container text-on-error-container text-[10px] font-bold rounded-full uppercase tracking-wider">Khẩn cấp</span>' : ""}
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant mb-lg">${stage.desc}</p>
        </div>
        ${btnHtml}
      </div>`;
    }).join("");
  }

  // Nhật ký thao tác gần đây
  const logEl = document.getElementById("control-log-list");
  if (logEl) {
    const logs = data.transactions.slice(0, 6);
    logEl.innerHTML = logs.length
      ? logs
          .map(
            (tx, i) => `
      <div class="flex gap-md group">
        <div class="flex flex-col items-center">
          <div class="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary border border-secondary/20">
            <span class="material-symbols-outlined text-[18px]">history</span>
          </div>
          ${i < logs.length - 1 ? '<div class="w-[2px] h-full bg-outline-variant mt-sm"></div>' : ""}
        </div>
        <div class="pb-md">
          <div class="flex items-center gap-sm mb-xs">
            <span class="font-label-md text-label-md">${tx.type}</span>
            <span class="font-body-sm text-body-sm text-on-surface-variant">${tx.time}</span>
          </div>
          <p class="font-body-sm text-body-sm text-on-surface-variant">Ví: <code class="bg-surface-container px-sm py-[2px] rounded text-primary">${bvShortAddr(tx.wallet)}</code></p>
        </div>
      </div>`,
          )
          .join("")
      : `<p class="font-body-sm text-body-sm text-on-surface-variant p-lg">Chưa có thao tác nào được ghi nhận.</p>`;
  }

  bvGuardAdmin(data);
}

function bvSetStage(stageKey) {
  const data = bvLoad();
  if (!bvGuardAdmin(data)) {
    alert("Bạn cần kết nối ví Admin để thực hiện thao tác này.");
    return;
  }
  const labelMap = {
    registration: "Mở đăng ký",
    verification: "Mở xác thực",
    voting: "Mở bỏ phiếu",
    ended: "Kết thúc bỏ phiếu",
  };
  if (
    stageKey === "ended" &&
    !confirm(
      "Kết thúc bầu cử sẽ chốt kết quả vĩnh viễn trên blockchain và không thể hoàn tác. Tiếp tục?",
    )
  ) {
    return;
  }
  data.election.status = stageKey;
  bvAddTransaction(data, labelMap[stageKey], data.admin.address, "success");
  bvSave(data);
  bvRenderControl();
}

document.addEventListener("DOMContentLoaded", () => {
  bvRenderControl();
  document.querySelectorAll(".group").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const icon = item.querySelector(".material-symbols-outlined");
      if (icon) icon.style.transform = "scale(1.1)";
    });
    item.addEventListener("mouseleave", () => {
      const icon = item.querySelector(".material-symbols-outlined");
      if (icon) icon.style.transform = "scale(1)";
    });
  });
});
