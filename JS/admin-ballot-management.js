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

// ====================== ADMIN-BALLOT-MANAGEMENT.JS ======================
// Trang Quản lý cuộc bầu cử — tích hợp THẬT với Smart Contract qua ethers.js.
//   - Tạo cuộc bầu cử: contract.createElection(title, description)
//   - Việc chuyển trạng thái (mở đăng ký/xác thực/bỏ phiếu/kết thúc) được
//     thực hiện ở trang "Điều khiển" (admin-system-control.html).
// Giao diện quản lý MỘT cuộc bầu cử "đang hoạt động" tại một thời điểm =
// cuộc bầu cử mới nhất được tạo (electionCount - 1).
import { getContract } from "./blockchain.js";
import { initAdminWallet, toast, runTx } from "./admin-common.js";
import {
  getActiveElectionId,
  getElectionPlain,
  getAllCandidatesPlain,
  getAllVotersPlain,
  STATUS_LABELS,
} from "./election-utils.js";

function bvStatusBadge(statusKey) {
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
  const s = map[statusKey] || map.draft;
  return `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${s.cls} font-label-md text-[12px]"><span class="w-1.5 h-1.5 rounded-full bg-current"></span>${s.text}</span>`;
}

function fmtTime(unixSeconds) {
  if (!unixSeconds) return "—";
  return new Date(unixSeconds * 1000).toLocaleString("vi-VN");
}

async function loadBallotPage() {
  const contract = getContract();
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  const row = document.getElementById("election-row");

  if (!contract) {
    if (row)
      row.innerHTML = `<td colspan="4" class="px-lg py-lg text-center text-on-surface-variant">Kết nối ví để tải dữ liệu từ Smart Contract...</td>`;
    return;
  }

  const [electionCount, candidates, voters] = await Promise.all([
    contract.electionCount(),
    getAllCandidatesPlain(contract),
    getAllVotersPlain(contract),
  ]);

  set("bs-total-elections", electionCount.toString());
  set("bs-total-candidates", candidates.length.toString());
  set("bs-total-voters", voters.length.toString());

  const activeElectionId = await getActiveElectionId(contract);
  if (activeElectionId === null) {
    if (row)
      row.innerHTML = `<td colspan="4" class="px-lg py-lg text-center text-on-surface-variant">Chưa có cuộc bầu cử nào. Bấm "Tạo cuộc bầu cử" để bắt đầu.</td>`;
    return;
  }

  const election = await getElectionPlain(contract, activeElectionId);
  if (row) {
    row.innerHTML = `
      <td class="px-lg py-lg">
        <p class="font-label-md text-label-md text-on-surface">${election.title}</p>
        <p class="font-body-sm text-body-sm text-on-surface-variant max-w-md line-clamp-2">${election.description || "—"}</p>
      </td>
      <td class="px-lg py-lg">
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[16px]">play_circle</span>
            <span class="font-mono-label text-mono-label">${fmtTime(election.startTime)}</span>
          </div>
          <div class="flex items-center gap-2 text-on-surface-variant">
            <span class="material-symbols-outlined text-[16px]">stop_circle</span>
            <span class="font-mono-label text-mono-label">${fmtTime(election.endTime)}</span>
          </div>
        </div>
      </td>
      <td class="px-lg py-lg text-center">${bvStatusBadge(election.statusKey)}</td>
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
window.bvToggleModal = bvToggleModal;

async function bvCreateElection(event) {
  event.preventDefault();
  const name = document.getElementById("election-name-input").value.trim();
  const desc = document.getElementById("election-desc-input").value.trim();
  if (!name) {
    toast("Vui lòng nhập tên cuộc bầu cử.", "error");
    return;
  }

  const receipt = await runTx(() => getContract().createElection(name, desc), {
    pendingMsg: "Đang gửi giao dịch tạo cuộc bầu cử lên blockchain...",
    successMsg: `Đã tạo cuộc bầu cử "${name}" thành công (đã ghi on-chain).`,
  });
  if (!receipt) return;

  bvToggleModal();
  await loadBallotPage();
}

document.addEventListener("DOMContentLoaded", async () => {
  await initAdminWallet();
  await loadBallotPage();

  const form = document.getElementById("create-election-form");
  if (form) form.addEventListener("submit", bvCreateElection);
  const openBtn = document.getElementById("open-create-modal-btn");
  if (openBtn) openBtn.addEventListener("click", bvToggleModal);

  window.addEventListener("bv:wallet-ready", loadBallotPage);
});

window.addEventListener("click", (event) => {
  const modal = document.getElementById("createModal");
  if (modal && event.target === modal) bvToggleModal();
});
