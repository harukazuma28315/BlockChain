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
   TRANG QUẢN LÝ ỨNG VIÊN — tích hợp ethers.js
   Thêm ứng viên (addCandidate) vào cuộc bầu cử hiện hành, Xác thực ứng viên
   (verifyCandidate). Contract không hỗ trợ sửa/xóa ứng viên nên các thao
   tác này không còn xuất hiện trên giao diện.
   ========================================================================= */
import {
  initAdminPage,
  getContract,
  guardAdmin,
  shortAddr,
  fetchCandidates,
  fetchCurrentElection,
} from "./admin-common.js";

let cachedCandidates = [];
let currentElection = null;

async function loadCandidates() {
  const contract = getContract();
  if (!contract) {
    cachedCandidates = [];
    currentElection = null;
    return;
  }
  [cachedCandidates, currentElection] = await Promise.all([
    fetchCandidates(contract),
    fetchCurrentElection(contract),
  ]);
}

function renderCandidates() {
  const tbody = document.getElementById("candidates-table-body");
  const emptyState = document.getElementById("candidates-empty-state");
  if (!tbody) return;

  const term = (document.getElementById("candidate-search")?.value || "")
    .toLowerCase()
    .trim();
  const filtered = cachedCandidates.filter(
    (c) =>
      c.name.toLowerCase().includes(term) ||
      c.wallet.toLowerCase().includes(term),
  );

  const countEl = document.getElementById("candidates-count");
  if (countEl)
    countEl.textContent = `Hiển thị ${filtered.length} trên tổng số ${cachedCandidates.length} ứng viên`;

  if (emptyState) emptyState.classList.toggle("hidden", filtered.length > 0);

  tbody.innerHTML = filtered
    .map(
      (c) => `
    <tr class="hover:bg-surface-container-lowest transition-colors">
      <td class="px-lg py-md">
        <div class="flex items-center gap-md">
          <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            ${c.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p class="font-label-md text-label-md text-on-surface">${c.name}</p>
            <p class="font-body-sm text-body-sm text-on-surface-variant italic">${shortAddr(c.wallet)}</p>
          </div>
        </div>
      </td>
      <td class="px-lg py-md">
        <p class="font-body-sm text-body-sm text-on-surface-variant max-w-xs line-clamp-2">${c.desc || "—"}</p>
      </td>
      <td class="px-lg py-md text-center">
        ${
          c.verified
            ? `<span class="px-md py-1 rounded-full bg-secondary-container/10 text-secondary-container font-label-md text-label-md border border-secondary-container/20">Đã xác thực</span>`
            : `<span class="px-md py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-md text-label-md border border-outline-variant">Chờ xác thực</span>`
        }
      </td>
      <td class="px-lg py-md text-center font-label-md text-label-md text-on-surface">${(c.votes || 0).toLocaleString("vi-VN")} phiếu</td>
      <td class="px-lg py-md text-right">
        <div class="flex items-center justify-end gap-sm">
          <button data-admin-only ${c.verified ? "disabled" : ""} onclick="bvVerifyCandidate(${c.id})"
            class="p-sm text-on-surface-variant hover:text-primary hover:bg-primary-fixed rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Xác thực ứng viên">
            <span class="material-symbols-outlined">verified</span>
          </button>
        </div>
      </td>
    </tr>`,
    )
    .join("");

  guardAdmin();
}

async function refreshAndRender() {
  const tbody = document.getElementById("candidates-table-body");
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-lg py-lg text-center text-on-surface-variant font-body-sm text-body-sm">Đang tải dữ liệu từ blockchain...</td></tr>`;
  }
  await loadCandidates();
  renderCandidates();
}

window.bvOpenAddCandidate = function () {
  const titleEl = document.getElementById("candidate-modal-title");
  if (titleEl) titleEl.textContent = "Thêm ứng viên mới";
  document.getElementById("add-candidate-form")?.reset();
  bvToggleModal("add-candidate-modal");
};

async function bvSaveCandidate(event) {
  event.preventDefault();
  const contract = getContract();
  if (!guardAdmin() || !contract) {
    alert("Bạn cần kết nối ví Admin để thực hiện thao tác này.");
    return;
  }
  if (!currentElection) {
    alert(
      "Chưa có cuộc bầu cử nào được tạo. Vui lòng tạo cuộc bầu cử ở trang Quản lý bầu cử trước.",
    );
    return;
  }
  const name = document.getElementById("candidate-name-input").value.trim();
  const wallet = document.getElementById("candidate-wallet-input").value.trim();
  const desc = document.getElementById("candidate-desc-input").value.trim();
  if (!name || !wallet) {
    alert("Vui lòng nhập đầy đủ Tên ứng viên và Địa chỉ ví.");
    return;
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
    alert("Địa chỉ ví không hợp lệ. Vui lòng nhập đúng định dạng 0x... (40 ký tự hex).");
    return;
  }
  try {
    const tx = await contract.addCandidate(currentElection.id, name, wallet, desc);
    await tx.wait();
    bvToggleModal("add-candidate-modal");
    await refreshAndRender();
  } catch (err) {
    console.error(err);
    alert("Giao dịch thất bại: " + (err.reason || err.message || "Không xác định"));
  }
}

window.bvVerifyCandidate = async function (id) {
  const contract = getContract();
  if (!guardAdmin() || !contract) return;
  try {
    const tx = await contract.verifyCandidate(id);
    await tx.wait();
    await refreshAndRender();
  } catch (err) {
    console.error(err);
    alert("Giao dịch thất bại: " + (err.reason || err.message || "Không xác định"));
  }
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
  await initAdminPage((state) => {
    if (state.connected) refreshAndRender();
    else renderCandidates();
  });

  const form = document.getElementById("add-candidate-form");
  if (form) form.addEventListener("submit", bvSaveCandidate);
  const search = document.getElementById("candidate-search");
  if (search) search.addEventListener("input", renderCandidates);

  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("mousedown", () => button.classList.add("scale-95"));
    button.addEventListener("mouseup", () => button.classList.remove("scale-95"));
    button.addEventListener("mouseleave", () => button.classList.remove("scale-95"));
  });
});

window.addEventListener("click", (event) => {
  const modal = document.getElementById("add-candidate-modal");
  if (modal && event.target === modal) bvToggleModal("add-candidate-modal");
});
