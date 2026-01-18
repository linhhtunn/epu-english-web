import "./login.css";

export default function Login() {
  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="brand">
          <div className="brand-box">
            <div className="brand-title">EPU</div>
            <div className="brand-line" />
            <div className="brand-sub">ENGLISH</div>
          </div>
        </div>

        <form className="form">
          <label className="label">
            <span className="label-row">
              <span className="icon">📞</span>
              <span>Số điện thoại</span>
            </span>
            <input className="input" placeholder="Nhập số điện thoại" />
          </label>

          <label className="label">
            <span className="label-row">
              <span className="icon">🔒</span>
              <span>Mật khẩu</span>
            </span>
            <input className="input" type="password" placeholder="Nhập mật khẩu" />
          </label>

          <label className="remember">
            <input type="checkbox" />
            <span>Ghi nhớ đăng nhập</span>
          </label>

          <button className="btn" type="submit">
            <span className="btn-icon">➜</span>
            <span>Đăng nhập</span>
          </button>

          <a className="forgot" href="#">
            Quên mật khẩu?
          </a>
        </form>
      </div>
    </div>
  );
}
