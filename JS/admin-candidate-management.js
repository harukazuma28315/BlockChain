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

// ====================== ADMIN-CANDIDATE-MANAGEMENT.JS ======================
// Trang Quản lý ứng viên — tích hợp THẬT với Smart Contract qua ethers.js.
// Chức năng khớp với những gì contract hỗ trợ:
//   - Thêm ứng viên vào MỘT cuộc bầu cử cụ thể: contract.addCandidate(electionId, ...)
//   - Xác thực ứng viên: contract.verifyCandidate(...)
// Trang này quản lý ứng viên theo TỪNG cuộc bầu cử riêng biệt: electionId
// được đọc từ URL (?electionId=X, đến từ nút "Xem ứng viên" ở trang Quản lý
// bầu cử). Nếu không có tham số, mặc định dùng cuộc bầu cử mới nhất.
// Lưu ý: Smart Contract KHÔNG hỗ trợ sửa hoặc xóa ứng viên sau khi đã thêm
// (đây là chủ đích thiết kế để đảm bảo tính minh bạch/không thể giả mạo của
// dữ liệu on-chain), nên UI không còn nút "Sửa" / "Xóa" như bản demo cũ.
import { getContract } from "./blockchain.js";
import { initAdminWallet, guardAdmin, toast, runTx } from "./admin-common.js";
import {
  getActiveElectionId,
  getElectionPlain,
  getCandidatesForElection,
  shortAddr,
} from "./election-utils.js";

const urlParams = new URLSearchParams(window.location.search);
const requestedElectionId = urlParams.has("electionId")
  ? BigInt(urlParams.get("electionId"))
  : null;

let activeElectionId = null;

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

async function loadCandidates() {
  const contract = getContract();
  const tbody = document.getElementById("candidates-table-body");
  const emptyState = document.getElementById("candidates-empty-state");
  if (!tbody) return;

  if (!contract) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-lg py-xl text-center text-on-surface-variant">Kết nối ví để tải dữ liệu từ Smart Contract...</td></tr>`;
    return;
  }

  activeElectionId =
    requestedElectionId !== null
      ? requestedElectionId
      : await getActiveElectionId(contract);

  if (activeElectionId === null) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-lg py-xl text-center text-on-surface-variant">Chưa có cuộc bầu cử nào được tạo. Vào trang "Quản lý bầu cử" để tạo cuộc bầu cử trước.</td></tr>`;
    if (emptyState) emptyState.classList.add("hidden");
    setText("candidate-election-context", "Chưa có cuộc bầu cử nào.");
    return;
  }

  const electionCount = await contract.electionCount();
  if (activeElectionId >= electionCount) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-lg py-xl text-center text-error">Không tìm thấy cuộc bầu cử #${activeElectionId}.</td></tr>`;
    if (emptyState) emptyState.classList.add("hidden");
    setText(
      "candidate-election-context",
      `Không tìm thấy cuộc bầu cử #${activeElectionId}.`,
    );
    return;
  }

  const election = await getElectionPlain(contract, activeElectionId);
  setText(
    "candidate-election-context",
    `Quản lý ứng viên của cuộc bầu cử: "${election.title}" (#${election.id})`,
  );

  let candidates;
  try {
    candidates = await getCandidatesForElection(contract, activeElectionId);
  } catch (err) {
    console.error(err);
    toast("Không tải được danh sách ứng viên từ Smart Contract.", "error");
    return;
  }

  const term = (document.getElementById("candidate-search")?.value || "")
    .toLowerCase()
    .trim();
  const filtered = candidates.filter(
    (c) =>
      c.fullName.toLowerCase().includes(term) ||
      c.wallet.toLowerCase().includes(term),
  );

  const countEl = document.getElementById("candidates-count");
  if (countEl)
    countEl.textContent = `Hiển thị ${filtered.length} trên tổng số ${candidates.length} ứng viên`;

  if (emptyState) emptyState.classList.toggle("hidden", filtered.length > 0);

  tbody.innerHTML = filtered
    .map(
      (c) => `
    <tr class="hover:bg-surface-container-lowest transition-colors">
      <td class="px-lg py-md">
        <div class="flex items-center gap-md">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            ${c.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p class="font-label-md text-label-md text-on-surface">${c.fullName}</p>
            <p class="font-body-sm text-body-sm text-on-surface-variant italic">${shortAddr(c.wallet)}</p>
          </div>
        </div>
      </td>
      <td class="px-lg py-md">
        <p class="font-body-sm text-body-sm text-on-surface-variant max-w-xs line-clamp-2">${c.description || "—"}</p>
      </td>
      <td class="px-lg py-md text-center">
        ${
          c.verified
            ? `<span class="px-md py-1 rounded-full bg-secondary-container/10 text-secondary-container font-label-md text-label-md border border-secondary-container/20">Đã xác thực</span>`
            : `<span class="px-md py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-md text-label-md border border-outline-variant">Chờ xác thực</span>`
        }
      </td>
      <td class="px-lg py-md text-center font-label-md text-label-md text-on-surface">${c.voteCount.toLocaleString("vi-VN")} phiếu</td>
      <td class="px-lg py-md text-right">
        <div class="flex items-center justify-end gap-sm">
          <button data-admin-only ${c.verified ? "disabled" : ""} onclick="bvVerifyCandidate(${c.id})"
            class="p-sm text-on-surface-variant hover:text-primary hover:bg-primary-fixed rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Xác thực ứng viên (ghi on-chain)">
            <span class="material-symbols-outlined">verified</span>
          </button>
        </div>
      </td>
    </tr>`,
    )
    .join("");

  guardAdmin();
}

function bvOpenAddCandidate() {
  document.getElementById("add-candidate-form")?.reset();
  bvToggleModal("add-candidate-modal");
}
window.bvOpenAddCandidate = bvOpenAddCandidate;

async function bvSaveCandidate(event) {
  event.preventDefault();
  if (activeElectionId === null) {
    toast(
      'Chưa có cuộc bầu cử nào. Hãy tạo cuộc bầu cử ở trang "Quản lý bầu cử" trước.',
      "error",
    );
    return;
  }
  const name = document.getElementById("candidate-name-input").value.trim();
  const wallet = document.getElementById("candidate-wallet-input").value.trim();
  const desc = document.getElementById("candidate-desc-input").value.trim();
  if (!name || !wallet) {
    toast("Vui lòng nhập đầy đủ Tên ứng viên và Địa chỉ ví.", "error");
    return;
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    toast(
      "Địa chỉ ví không hợp lệ. Vui lòng nhập đúng định dạng 0x + 40 ký tự hex.",
      "error",
    );
    return;
  }

  const receipt = await runTx(
    () => getContract().addCandidate(activeElectionId, name, wallet, desc),
    {
      pendingMsg: "Đang gửi giao dịch thêm ứng viên lên blockchain...",
      successMsg: `Đã thêm ứng viên "${name}" thành công (đã ghi on-chain).`,
    },
  );
  if (!receipt) return;

  bvToggleModal("add-candidate-modal");
  await loadCandidates();
}

window.bvVerifyCandidate = async function bvVerifyCandidate(candidateId) {
  const receipt = await runTx(
    () => getContract().verifyCandidate(candidateId),
    {
      pendingMsg: "Đang gửi giao dịch xác thực ứng viên...",
      successMsg: "Đã xác thực ứng viên thành công (đã ghi on-chain).",
    },
  );
  if (receipt) await loadCandidates();
};

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
window.bvToggleModal = bvToggleModal;

document.addEventListener("DOMContentLoaded", async () => {
  await initAdminWallet();
  await loadCandidates();

  const form = document.getElementById("add-candidate-form");
  if (form) form.addEventListener("submit", bvSaveCandidate);
  const search = document.getElementById("candidate-search");
  if (search) search.addEventListener("input", loadCandidates);
  const openBtn = document.getElementById("open-add-candidate-btn");
  if (openBtn) openBtn.addEventListener("click", bvOpenAddCandidate);

  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("mousedown", () =>
      button.classList.add("scale-95"),
    );
    button.addEventListener("mouseup", () =>
      button.classList.remove("scale-95"),
    );
    button.addEventListener("mouseleave", () =>
      button.classList.remove("scale-95"),
    );
  });

  window.addEventListener("bv:wallet-ready", loadCandidates);
});

window.addEventListener("click", (event) => {
  const modal = document.getElementById("add-candidate-modal");
  if (modal && event.target === modal) bvToggleModal("add-candidate-modal");
});
