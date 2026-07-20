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
          {
            lineHeight: "16px",
            letterSpacing: "0.02em",
            fontWeight: "500",
          },
        ],
        "label-md": [
          "14px",
          {
            lineHeight: "20px",
            letterSpacing: "0.05em",
            fontWeight: "600",
          },
        ],
        "headline-lg": [
          "32px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.01em",
            fontWeight: "600",
          },
        ],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg-mobile": [
          "24px",
          { lineHeight: "32px", fontWeight: "600" },
        ],
        "display-lg": [
          "48px",
          {
            lineHeight: "56px",
            letterSpacing: "-0.02em",
            fontWeight: "700",
          },
        ],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
      },
    },
  },
};

/* =========================================================================
 * BVStore - kho du lieu mo phong on-chain bang localStorage.
 * QUAN TRONG: khoa luu tru (BV_STORE_KEY), ten ham (bvLoad/bvSave) va
 * BV_ADMIN_ADDRESS phai TRUNG voi cac file JS phia Admin (da sua o luot
 * truoc) thi moi nhan dien dung vai tro. Neu phia Admin dung khoa khac,
 * hay gui lai 1 file JS admin bat ky de dong bo chinh xac.
 * ========================================================================= */
const BV_STORE_KEY = "bv_voting_data";
const BV_ADMIN_ADDRESS = "0xa1b517e141F6d7BE60555dfaBCf27Fdc536C20AA";

// Duong dan trang dich (tuong doi tu pages/auth/connect-wallet.html)
const BV_ADMIN_HOME_PATH = "../admin/admin-dashboard.html";
const BV_VOTER_HOME_PATH = "../voting/create-ballot.html";

function bvLoad() {
  try {
    const raw = localStorage.getItem(BV_STORE_KEY);
    if (!raw) {
      return {
        admin: { address: "", connected: false, isAdmin: false },
        voters: [],
        candidates: [],
        election: {},
        transactions: [],
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    return {
      admin: { address: "", connected: false, isAdmin: false },
      voters: [],
      candidates: [],
      election: {},
      transactions: [],
    };
  }
}

function bvSave(data) {
  localStorage.setItem(BV_STORE_KEY, JSON.stringify(data));
}

function bvFindVoter(address, store) {
  const list = (store && store.voters) || [];
  return list.find(
    (v) => (v.address || "").toLowerCase() === address.toLowerCase(),
  );
}

function bvShortAddress(addr) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function bvGetRole(address, store) {
  if (address.toLowerCase() === BV_ADMIN_ADDRESS.toLowerCase()) {
    return { role: "admin", label: "Quản trị viên (Admin)" };
  }
  const voter = bvFindVoter(address, store);
  if (voter && voter.verified) {
    return { role: "voter-verified", label: "Cử tri (Đã xác thực)" };
  }
  if (voter && !voter.verified) {
    return { role: "voter-unverified", label: "Cử tri (Chưa xác thực)" };
  }
  return { role: "unregistered", label: "Chưa đăng ký (không có quyền)" };
}

/* ------------------------------------------------------------------------ */

const connectBtn = document.getElementById("connect-btn");
const connectBtnLabel = document.getElementById("connect-btn-label");
const connectionContent = document.getElementById("connection-content");
const connectedContent = document.getElementById("connected-content");
const statusBadge = document.getElementById("status-badge");
const navWalletBadge = document.getElementById("nav-wallet-badge");
const navAddress = document.getElementById("nav-address");
const card = document.getElementById("connection-card");
const walletAddressEl = document.getElementById("wallet-address");
const roleStatusEl = document.getElementById("role-status");
const noMetaMaskNotice = document.getElementById("no-metamask-notice");

let bvCurrentAddress = null;
let bvCurrentRole = null;

function bvShowConnectedUI(address) {
  bvCurrentAddress = address;
  const store = bvLoad();
  const roleInfo = bvGetRole(address, store);
  bvCurrentRole = roleInfo.role;

  // Ghi lại trạng thái đăng nhập admin nếu đúng ví admin (đồng bộ với BVStore)
  if (roleInfo.role === "admin") {
    store.admin = { address, connected: true, isAdmin: true };
    bvSave(store);
  }

  connectionContent.classList.add("opacity-0");
  setTimeout(() => {
    connectionContent.classList.add("hidden");
    connectedContent.classList.remove("hidden");
    connectedContent.classList.add("opacity-0");

    walletAddressEl.textContent = bvShortAddress(address);
    roleStatusEl.textContent = roleInfo.label;
    roleStatusEl.classList.remove(
      "text-primary",
      "text-error",
      "text-emerald-600",
    );
    roleStatusEl.classList.add(
      roleInfo.role === "unregistered"
        ? "text-error"
        : roleInfo.role === "voter-unverified"
          ? "text-tertiary"
          : "text-emerald-600",
    );

    statusBadge.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-emerald-500 pulse-emerald"></span>
      Đã kết nối
    `;
    statusBadge.classList.remove("bg-surface-variant", "text-on-surface-variant");
    statusBadge.classList.add("bg-emerald-50", "text-emerald-700", "border-emerald-200");

    navAddress.textContent = bvShortAddress(address);
    navWalletBadge.classList.remove("hidden");

    setTimeout(() => {
      connectedContent.classList.remove("opacity-0");
      connectedContent.classList.add("transition-opacity", "duration-500", "opacity-100");
    }, 50);
  }, 300);
}

function bvShowDisconnectedUI() {
  bvCurrentAddress = null;
  bvCurrentRole = null;

  connectedContent.classList.add("hidden");
  connectionContent.classList.remove("hidden", "opacity-0");
  connectBtn.disabled = false;
  connectBtnLabel.textContent = "Kết nối MetaMask";

  statusBadge.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-neutral-400"></span>
    Chưa kết nối
  `;
  statusBadge.classList.remove("bg-emerald-50", "text-emerald-700", "border-emerald-200");
  statusBadge.classList.add("bg-surface-variant", "text-on-surface-variant");

  navWalletBadge.classList.add("hidden");
}

async function bvHandleConnectClick() {
  if (typeof window.ethereum === "undefined") {
    noMetaMaskNotice.classList.remove("hidden");
    return;
  }
  noMetaMaskNotice.classList.add("hidden");

  connectBtn.disabled = true;
  connectBtnLabel.textContent = "Đang xử lý...";

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const address = accounts && accounts[0];
    if (!address) throw new Error("Không lấy được địa chỉ ví.");
    bvShowConnectedUI(address);
  } catch (err) {
    connectBtn.disabled = false;
    connectBtnLabel.textContent = "Kết nối MetaMask";
    if (err && err.code === 4001) {
      alert("Bạn đã từ chối kết nối ví trong MetaMask.");
    } else {
      alert(
        "Kết nối ví thất bại: " +
          (err && err.message ? err.message : "Lỗi không xác định"),
      );
    }
  }
}

connectBtn.addEventListener("click", bvHandleConnectClick);

// Ngắt kết nối (chỉ ở mức phiên làm việc của web app - MetaMask không cho
// phép ứng dụng chủ động huỷ quyền truy cập từ phía trình duyệt).
function disconnectWallet() {
  bvShowDisconnectedUI();
}

// Điều hướng sang đúng giao diện theo vai trò đã xác định
function continueToDashboard() {
  if (!bvCurrentAddress || !bvCurrentRole) return;

  if (bvCurrentRole === "admin") {
    window.location.href = BV_ADMIN_HOME_PATH;
    return;
  }
  if (bvCurrentRole === "voter-verified") {
    window.location.href = BV_VOTER_HOME_PATH;
    return;
  }
  if (bvCurrentRole === "voter-unverified") {
    alert(
      "Ví của bạn đã được thêm vào danh sách cử tri nhưng chưa được Admin xác thực. Vui lòng quay lại sau khi được xác thực.",
    );
    return;
  }
  alert(
    "Địa chỉ ví này chưa được đăng ký làm cử tri. Vui lòng liên hệ Quản trị viên để được thêm vào danh sách.",
  );
}

// Khôi phục phiên kết nối sẵn có (không hiện popup) khi tải lại trang
document.addEventListener("DOMContentLoaded", () => {
  if (typeof window.ethereum === "undefined") {
    return;
  }
  window.ethereum
    .request({ method: "eth_accounts" })
    .then((accounts) => {
      if (accounts && accounts[0]) {
        bvShowConnectedUI(accounts[0]);
      }
    })
    .catch(() => {});

  window.ethereum.on &&
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts && accounts[0]) {
        bvShowConnectedUI(accounts[0]);
      } else {
        bvShowDisconnectedUI();
      }
    });

  window.ethereum.on &&
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
});
