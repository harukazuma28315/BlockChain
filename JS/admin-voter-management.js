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

// ====================== ADMIN-VOTER-MANAGEMENT.JS ======================
// Trang Quản lý cử tri — tích hợp THẬT với Smart Contract qua ethers.js.
// Chức năng khớp với contract:
//   - Thêm cử tri (whitelist): contract.registerVoter(name, wallet)
//   - Xác thực cử tri: contract.verifyVoter(wallet)
//   - Khóa / Mở quyền bỏ phiếu: contract.disableVoter(wallet) / enableVoter(wallet)
// Lưu ý: Smart Contract KHÔNG hỗ trợ xóa cử tri khỏi whitelist (dữ liệu
// on-chain là vĩnh viễn), nên nút "Xóa" của bản demo cũ đã được bỏ, thay
// bằng "Khóa quyền bỏ phiếu" (vẫn đạt mục đích ngăn cử tri đó bỏ phiếu).
import { getContract } from "./blockchain.js";
import { initAdminWallet, guardAdmin, toast, runTx } from "./admin-common.js";
import { getAllVotersPlain, shortAddr } from "./election-utils.js";

async function loadVoters() {
  const contract = getContract();
  const tbody = document.getElementById("voters-table-body");
  const emptyState = document.getElementById("voters-empty-state");
  if (!tbody) return;

  if (!contract) {
    tbody.innerHTML = `<tr><td colspan="4" class="px-lg py-xl text-center text-on-surface-variant">Kết nối ví để tải dữ liệu từ Smart Contract...</td></tr>`;
    return;
  }

  let voters;
  try {
    voters = await getAllVotersPlain(contract);
  } catch (err) {
    console.error(err);
    toast("Không tải được danh sách cử tri từ Smart Contract.", "error");
    return;
  }

  const term = (document.getElementById("voter-search")?.value || "")
    .toLowerCase()
    .trim();
  const filtered = voters.filter(
    (v) =>
      v.fullName.toLowerCase().includes(term) ||
      v.wallet.toLowerCase().includes(term),
  );

  const countEl = document.getElementById("voters-count");
  if (countEl)
    countEl.textContent = `Hiển thị ${filtered.length} trên tổng số ${voters.length} cử tri`;

  if (emptyState) emptyState.classList.toggle("hidden", filtered.length > 0);

  tbody.innerHTML = filtered
    .map(
      (v) => `
    <tr class="hover:bg-surface-container-lowest transition-colors">
      <td class="px-lg py-md">
        <div class="flex items-center gap-md">
          <div class="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container">
            <span class="material-symbols-outlined text-[18px]">person</span>
          </div>
          <div>
            <p class="font-label-md text-label-md text-on-surface">${v.fullName}</p>
            <p class="font-mono-label text-mono-label text-on-surface-variant">${shortAddr(v.wallet)}</p>
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
          !v.active
            ? `<span class="inline-flex items-center gap-xs px-sm py-xs bg-error-container/30 text-on-error-container rounded-full font-label-md text-label-md"><span class="material-symbols-outlined text-[14px]">lock</span>Đã khóa</span>`
            : `<span class="inline-flex items-center gap-xs px-sm py-xs bg-primary-fixed text-primary rounded-full font-label-md text-label-md"><span class="material-symbols-outlined text-[14px]">lock_open</span>Được phép bầu</span>`
        }
      </td>
      <td class="px-lg py-md text-right">
        <div class="flex items-center justify-end gap-sm">
          <button data-admin-only ${v.verified ? "disabled" : ""} onclick="bvVerifyVoter('${v.wallet}')"
            class="p-sm text-on-surface-variant hover:text-primary hover:bg-primary-fixed rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            title="Xác thực cử tri (ghi on-chain)">
            <span class="material-symbols-outlined">how_to_reg</span>
          </button>
          <button data-admin-only onclick="bvToggleLockVoter('${v.wallet}', ${v.active})"
            class="p-sm text-on-surface-variant hover:text-amber-600 hover:bg-amber-100/50 rounded-lg transition-all"
            title="${v.active ? "Khóa quyền bỏ phiếu" : "Mở quyền bỏ phiếu"} (ghi on-chain)">
            <span class="material-symbols-outlined">${v.active ? "lock_open" : "lock"}</span>
          </button>
        </div>
      </td>
    </tr>`,
    )
    .join("");

  guardAdmin();
}

async function bvAddVoter(event) {
  event.preventDefault();
  const name = document.getElementById("voter-name-input").value.trim();
  const address = document.getElementById("voter-address-input").value.trim();
  if (!name || !address) {
    toast("Vui lòng nhập đầy đủ Họ tên và Địa chỉ ví.", "error");
    return;
  }
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    toast("Địa chỉ ví không hợp lệ. Vui lòng nhập đúng định dạng 0x + 40 ký tự hex.", "error");
    return;
  }

  const receipt = await runTx(
    () => getContract().registerVoter(name, address),
    {
      pendingMsg: "Đang gửi giao dịch thêm cử tri lên blockchain...",
      successMsg: `Đã thêm cử tri "${name}" thành công (đã ghi on-chain).`,
    },
  );
  if (!receipt) return;

  bvToggleModal("add-voter-modal");
  document.getElementById("add-voter-form")?.reset();
  await loadVoters();
}

window.bvVerifyVoter = async function bvVerifyVoter(wallet) {
  const receipt = await runTx(() => getContract().verifyVoter(wallet), {
    pendingMsg: "Đang gửi giao dịch xác thực cử tri...",
    successMsg: "Đã xác thực cử tri thành công (đã ghi on-chain).",
  });
  if (receipt) await loadVoters();
};

window.bvToggleLockVoter = async function bvToggleLockVoter(wallet, isActive) {
  const call = isActive
    ? () => getContract().disableVoter(wallet)
    : () => getContract().enableVoter(wallet);
  const receipt = await runTx(call, {
    pendingMsg: isActive
      ? "Đang khóa quyền bỏ phiếu của cử tri..."
      : "Đang mở lại quyền bỏ phiếu của cử tri...",
    successMsg: isActive
      ? "Đã khóa quyền bỏ phiếu (đã ghi on-chain)."
      : "Đã mở lại quyền bỏ phiếu (đã ghi on-chain).",
  });
  if (receipt) await loadVoters();
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
  await loadVoters();

  const form = document.getElementById("add-voter-form");
  if (form) form.addEventListener("submit", bvAddVoter);
  const search = document.getElementById("voter-search");
  if (search) search.addEventListener("input", loadVoters);

  window.addEventListener("bv:wallet-ready", loadVoters);
});

window.addEventListener("click", (event) => {
  const modal = document.getElementById("add-voter-modal");
  if (modal && event.target === modal) bvToggleModal("add-voter-modal");
});
