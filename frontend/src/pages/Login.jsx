import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

// Import tài nguyên ảnh
import anhNen1 from "../assets/avtLogin2.jpg";
import anhNen2 from "../assets/avtLogin3.jpg";
import anhNen3 from "../assets/anh3.jpg";
import logoBrand from "../assets/anh4.png";
import avtLogin from "../assets/avtLogin.jpg";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        document.title = "Đăng nhập | EPU English";
    }, []);

    const bannerImages = [avtLogin, anhNen1, anhNen2, anhNen3];

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post("/auth/login", { email, password });
            const data = response.data;

            login(data);

            switch (data.role) {
                case "Admin":
                    navigate("/admin");
                    break;
                case "Giao_Vien":
                    navigate("/teacher");
                    break;
                case "Phu_Huynh":
                    navigate("/parent");
                    break;
                case "Hoc_Sinh":
                    navigate("/student");
                    break;
                default:
                    navigate("/");
            }
        } catch (error) {
            console.error("Lỗi kết nối:", error);
            const message =
                error.response?.data?.message ||
                "Không thể kết nối đến máy chủ. Hãy kiểm tra Backend!";
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="login-page container-fluid vh-100 p-0 overflow-hidden"
            style={{ backgroundColor: "#005197" }}
        >
            <div className="row g-0 h-100">
                {/* BÊN TRÁI: Slideshow (Giữ nguyên giao diện đẹp của bạn) */}
                <div className="col-lg-7 d-none d-lg-flex align-items-center justify-content-center h-100">
                    <div
                        className="brand-section text-center position-relative"
                        style={{
                            width: "100%",
                            maxWidth: "850px",
                            padding: "0 80px",
                        }}
                    >
                        <button
                            className="custom-nav-btn btn-prev"
                            type="button"
                            data-bs-target="#bannerCarousel"
                            data-bs-slide="prev"
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <div className="bg-white p-1 rounded-4 shadow-lg overflow-hidden">
                            <div
                                id="bannerCarousel"
                                className="carousel slide"
                                data-bs-ride="carousel"
                                data-bs-interval="3000"
                            >
                                <div className="carousel-inner rounded-3">
                                    {bannerImages.map((imgSrc, index) => (
                                        <div
                                            key={index}
                                            className={`carousel-item ${index === 0 ? "active" : ""}`}
                                        >
                                            <img
                                                src={imgSrc}
                                                className="d-block w-100"
                                                alt={`Slide ${index + 1}`}
                                                style={{
                                                    height: "55vh",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            className="custom-nav-btn btn-next"
                            type="button"
                            data-bs-target="#bannerCarousel"
                            data-bs-slide="next"
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                        <h2
                            className="fw-bold mt-4 text-white"
                            style={{ letterSpacing: "1px" }}
                        >
                            WHERE THE BEST BECOME BETTER
                        </h2>
                    </div>
                </div>

                {/* BÊN PHẢI: Form Đăng nhập */}
                <div className="col-lg-5 d-flex flex-column align-items-center justify-content-center p-4 h-100">
                    <div className="text-center mb-5">
                        <div
                            style={{
                                width: "150px",
                                height: "150px",
                                backgroundColor: "#ffffff",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto",
                                padding: "20px",
                                border: "6px solid rgba(255, 255, 255, 0.25)",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                            }}
                        >
                            <img
                                src={logoBrand}
                                alt="EPU English Logo"
                                style={{
                                    width: "100%",
                                    height: "auto",
                                    objectFit: "contain",
                                }}
                            />
                        </div>
                    </div>
                    <div
                        className="login-card shadow-lg bg-white p-5"
                        style={{
                            maxWidth: "450px",
                            width: "100%",
                            borderRadius: "32px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                            marginTop: "-15px",
                        }}
                    >
                        <h2 className="fw-bold text-dark mb-1 text-center">
                            Sign in to EPU English
                        </h2>
                        <p className="text-muted small mb-4 text-center">
                            Enter your details below
                        </p>

                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-secondary">
                                    Email
                                </label>
                                <div className="input-group border rounded-3 p-2 bg-light">
                                    <span className="input-group-text bg-transparent border-0 text-muted">
                                        <i className="bi bi-envelope"></i>
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control border-0 bg-transparent shadow-none"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="d-flex justify-content-between">
                                    <label className="form-label small fw-bold text-secondary">
                                        Password
                                    </label>
                                    <a
                                        href="#"
                                        className="small text-decoration-none fw-bold"
                                        style={{ color: "#005197" }}
                                    >
                                        Forgot?
                                    </a>
                                </div>
                                <div className="input-group border rounded-3 p-2 bg-light">
                                    <span className="input-group-text bg-transparent border-0 text-muted">
                                        <i className="bi bi-lock"></i>
                                    </span>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className="form-control border-0 bg-transparent shadow-none"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn border-0 bg-transparent text-muted"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        <i
                                            className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                                        ></i>
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="btn w-100 py-3 rounded-pill fw-bold text-white transition-all mt-2"
                                disabled={loading || !email || !password}
                                style={{
                                    backgroundColor:
                                        email && password
                                            ? "#ef7d00"
                                            : "#dcdcdc",
                                    boxShadow:
                                        email && password
                                            ? "0 6px 15px rgba(239, 125, 0, 0.4)"
                                            : "none",
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
